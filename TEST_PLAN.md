# LoL Skin Tracker v2.0 - Comprehensive Test Plan

## 🎯 **Test Strategy Overview**

### **Testing Scope:**
- Electron app functionality
- UI/UX interactions
- Data persistence
- API integration
- Performance validation
- Error handling

### **Test Environment:**
- Playwright + Electron
- MCP integration for automated execution
- JSON reporting for structured results
- Screenshot/video capture on failures

---

## 📋 **Test Suites**

### **1. Core App Functionality** (`core-functionality.spec.ts`)

**Test Cases:**
- ✅ App launches successfully with correct branding
- ✅ Champion data loads from DataDragon API (171+ champions)
- ✅ Progress bar displays correctly with initial stats (0/171 owned)
- ✅ All UI components render properly
- ✅ Window sizing and constraints work correctly

**Validation Points:**
- Window title: "LoL Skin Tracker v1.0"
- HTML title matches window title
- Champion cards have proper test IDs
- Debug info shows champion count
- No console errors during startup

---

### **2. Search & Filtering** (`search-filter.spec.ts`)

**Test Cases:**
- Search functionality (type, clear, Esc key)
- Filter buttons (All, Owned, Missing, Shards, Both)
- Combined search + filter scenarios
- Keyboard shortcuts (Ctrl+F)
- Results count accuracy

**Test Scenarios:**
```
┌─────────────────┬─────────────┬─────────────┬──────────────┐
│ Filter          │ Search Term │ Expected    │ Notes        │
├─────────────────┼─────────────┼─────────────┼──────────────┤
│ All             │ ""          │ 171 champs  │ Full list    │
│ All             │ "Ahri"      │ 1 champ     │ Exact match  │
│ All             │ "invalid"   │ 0 champs    │ No results   │
│ Owned           │ ""          │ 0 champs    │ Fresh start  │
│ Missing         │ ""          │ 171 champs  │ All missing  │
└─────────────────┴─────────────┴─────────────┴──────────────┘
```

**Edge Cases:**
- Special characters in search
- Case sensitivity testing
- Very long search terms
- Rapid filter switching

---

### **3. Champion Interaction** (`champion-interaction.spec.ts`)

**Test Cases:**
- Skin button toggle (owned/unowned)
- Shard button toggle (owned/unowned)
- Visual state changes (gold/blue borders)
- Tooltips on hover
- Multiple champion interactions

**Visual State Validation:**
```
┌──────────┬────────────┬─────────────────────────────────┐
│ Skin     │ Shard      │ Expected Visual State           │
├──────────┼────────────┼─────────────────────────────────┤
│ Unowned  │ Unowned    │ Gray border (ring-1 ring-gray)  │
│ Owned    │ Unowned    │ Gold border + shadow            │
│ Unowned  │ Owned      │ Blue border + shadow            │
│ Owned    │ Owned      │ Enhanced gold border + shadow   │
└──────────┴────────────┴─────────────────────────────────┘
```

**Interaction Flow Tests:**
- Click skin → verify visual change → verify stats update
- Click shard → verify visual change → verify stats update
- Toggle both → verify combined state
- Filter by owned/shards after interactions

---

### **4. Data Persistence** (`data-persistence.spec.ts`)

**Test Cases:**
- Save collection data on toggle
- Load collection data on app restart
- Maintain state across sessions
- localStorage integrity
- Large dataset handling

**Test Flow:**
1. Fresh app start (clean localStorage)
2. Toggle 10 random champions (mix of skins/shards)
3. Close app completely
4. Restart app
5. Verify all 10 champions maintain their state
6. Verify progress bar reflects saved data

**Data Validation:**
- Check localStorage key structure
- Verify JSON format integrity
- Test with corrupted data scenarios
- Performance with 100+ owned champions

---

### **5. Statistics & Progress** (`statistics.spec.ts`)

**Test Cases:**
- Progress bar calculation accuracy
- Statistics cards update correctly
- Percentage calculations
- Edge case scenarios (0%, 100%)

**Calculation Tests:**
```javascript
// Test scenarios
const testCases = [
  { skins: 0, shards: 0, total: 171, expected: { progress: 0, shardsOnly: 0 } },
  { skins: 85, shards: 100, total: 171, expected: { progress: 49.7, shardsOnly: 15 } },
  { skins: 171, shards: 171, total: 171, expected: { progress: 100, shardsOnly: 0 } }
];
```

---

### **6. Performance & UX** (`performance.spec.ts`)

**Test Cases:**
- App startup time (< 3 seconds to first paint)
- Champion grid scroll performance
- Search responsiveness (< 200ms filter)
- Memory usage validation
- Animation smoothness

**Performance Benchmarks:**
- Initial load: < 5 seconds
- Search results: < 200ms
- Filter switching: < 100ms
- Champion toggle: < 50ms
- Smooth 60fps scrolling

---

### **7. Error Handling** (`error-handling.spec.ts`)

**Test Cases:**
- API failure scenarios
- Network connectivity issues
- Corrupted localStorage data
- Invalid champion data
- Graceful degradation

**Error Scenarios:**
- Mock API to return 404/500 errors
- Simulate network timeouts
- Test with malformed JSON in localStorage
- Verify fallback to static champion data (169 champions)
- Error messages are user-friendly

---

### **8. Keyboard & Accessibility** (`accessibility.spec.ts`)

**Test Cases:**
- Tab navigation through UI
- Keyboard shortcuts functionality
- Screen reader compatibility
- Focus management
- ARIA labels validation

**Keyboard Shortcuts:**
- `Ctrl+F` → Focus search input
- `Esc` → Clear search
- `Tab` → Navigate through filters
- `Enter/Space` → Activate buttons

---

## 🔧 **Test Infrastructure**

### **Test Data Management:**
- Champion data snapshots for consistent testing
- Mock API responses for error scenarios
- Test champion collections for persistence tests

### **Visual Regression:**
- Screenshot comparisons for visual states
- CSS class validation for borders/styling
- Color verification for gold/blue themes

### **Performance Monitoring:**
- Execution time tracking
- Memory usage monitoring
- Frame rate validation during animations

---

## 📊 **Success Criteria**

### **Minimum Requirements:**
- ✅ 95% test pass rate
- ✅ All core functionality covered
- ✅ Performance benchmarks met
- ✅ No critical bugs found

### **Quality Gates:**
- Zero console errors during normal operation
- Consistent behavior across test runs
- Proper cleanup after each test
- Comprehensive error handling coverage

---

## 🚀 **Implementation Priority**

### **Phase 1** (Immediate):
1. Champion Interaction tests
2. Data Persistence tests  
3. Search & Filtering tests

### **Phase 2** (Next):
4. Statistics validation
5. Performance benchmarks
6. Error handling scenarios

### **Phase 3** (Future):
7. Accessibility compliance
8. Visual regression testing
9. Load testing with large datasets

---

## 🎯 **Expected Outcomes**

After implementation, we'll have:
- **Automated quality assurance** for all app features
- **Regression prevention** for future changes
- **Performance monitoring** and benchmarks
- **Documentation** of expected behavior
- **Confidence** in production deployments

---

**Total Estimated Test Cases:** ~45-60 individual tests
**Estimated Implementation Time:** 2-3 hours for full suite
**Maintenance Effort:** Low (tests update with features)