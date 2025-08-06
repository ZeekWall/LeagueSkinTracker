import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

export interface Champion {
  id: string;
  name: string;
  title: string;
  hasSkin: boolean;
  hasShard: boolean;
  imageUrl?: string;
  lastUpdated: string;
}

export interface PatchInfo {
  version: string;
  patchNotesUrl: string;
}

export class DatabaseManager {
  private db!: DatabaseType;
  private dbPath: string;

  constructor() {
    const userDataPath = path.join(process.env.APPDATA || '', 'LeagueSkinTracker');
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    this.dbPath = path.join(userDataPath, 'champions.db');
  }

  async initialize(): Promise<void> {
    try {
      this.db = new Database(this.dbPath);
      await this.createTables();
    } catch (error) {
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const createChampionsTable = `
      CREATE TABLE IF NOT EXISTS champions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        hasSkin BOOLEAN DEFAULT FALSE,
        hasShard BOOLEAN DEFAULT FALSE,
        imageUrl TEXT,
        lastUpdated TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createPatchInfoTable = `
      CREATE TABLE IF NOT EXISTS patch_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT NOT NULL,
        patchNotesUrl TEXT,
        lastUpdated TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.exec(createChampionsTable);
    this.db.exec(createPatchInfoTable);
  }

  async getChampions(): Promise<Champion[]> {
    const query = 'SELECT * FROM champions ORDER BY name';
    const rows = this.db.prepare(query).all();
    return rows.map((row: any) => ({
      ...row,
      hasSkin: Boolean(row.hasSkin),
      hasShard: Boolean(row.hasShard)
    }));
  }

  async updateChampionStatus(championId: string, hasSkin: boolean, hasShard: boolean): Promise<boolean> {
    const query = `
      UPDATE champions 
      SET hasSkin = ?, hasShard = ?, lastUpdated = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    const result = this.db.prepare(query).run(hasSkin ? 1 : 0, hasShard ? 1 : 0, championId);
    return result.changes > 0;
  }

  async bulkUpdateChampions(championIds: string[], hasSkin: boolean, hasShard: boolean): Promise<boolean> {
    const placeholders = championIds.map(() => '?').join(',');
    const query = `
      UPDATE champions 
      SET hasSkin = ?, hasShard = ?, lastUpdated = CURRENT_TIMESTAMP 
      WHERE id IN (${placeholders})
    `;
    const params = [hasSkin ? 1 : 0, hasShard ? 1 : 0, ...championIds];
    
    const result = this.db.prepare(query).run(...params);
    return result.changes > 0;
  }

  async upsertChampions(champions: Omit<Champion, 'hasSkin' | 'hasShard' | 'lastUpdated'>[]): Promise<void> {
    const query = `
      INSERT OR REPLACE INTO champions (id, name, title, imageUrl, lastUpdated)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    const stmt = this.db.prepare(query);
    const transaction = this.db.transaction(() => {
      champions.forEach(champion => {
        stmt.run(champion.id, champion.name, champion.title, champion.imageUrl);
      });
    });
    transaction();
  }

  async upsertFullChampions(champions: Champion[]): Promise<void> {
    const query = `
      INSERT OR REPLACE INTO champions (id, name, title, hasSkin, hasShard, imageUrl, lastUpdated)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    const stmt = this.db.prepare(query);
    const transaction = this.db.transaction(() => {
      champions.forEach(champion => {
        stmt.run(
          champion.id, 
          champion.name, 
          champion.title, 
          champion.hasSkin ? 1 : 0, 
          champion.hasShard ? 1 : 0, 
          champion.imageUrl
        );
      });
    });
    transaction();
  }

  async getPatchInfo(): Promise<PatchInfo | null> {
    const query = 'SELECT version, patchNotesUrl FROM patch_info ORDER BY lastUpdated DESC LIMIT 1';
    const row = this.db.prepare(query).get() as any;
    return row && row.version ? row as PatchInfo : null;
  }

  async updatePatchInfo(patchInfo: PatchInfo): Promise<void> {
    const query = 'INSERT OR REPLACE INTO patch_info (version, patchNotesUrl, lastUpdated) VALUES (?, ?, CURRENT_TIMESTAMP)';
    this.db.prepare(query).run(patchInfo.version, patchInfo.patchNotesUrl);
  }

  async exportData(): Promise<{ champions: Champion[], patchInfo: PatchInfo | null }> {
    const champions = await this.getChampions();
    const patchInfo = await this.getPatchInfo();
    return { champions, patchInfo };
  }

  close(): void {
    if (this.db) {
      this.db.close();
    }
  }
} 