# BabySittingFilters Component Documentation

This document provides detailed documentation for the BabySittingFilters component using the DIVO framework.

## Overview

The BabySittingFilters component provides a user interface for filtering babysitting entries by year and month. It features a year dropdown selector and a horizontally scrollable month selector with the selected filter always kept visible in the scrollable area.

## DIVO Framework Analysis

### Data

The BabySittingFilters component manages several key data elements:

#### State Management
- **selectedYear**: Tracks the currently selected year (default: current year)
- **selectedMonth**: Tracks the currently selected month (default: current month)
- **filter**: Global application state managed via Recoil, containing the selected year and month

#### Data Sources
- **years**: List of the last three years, calculated from the current year
- **allMonths**: List of all months in French, imported from a utility module
- **currentMonthName**: The name of the current month, formatted with proper capitalization
- **selectedMonthIndex**: The index of the currently selected month in the allMonths array
- **displayedMonths**: Processed month data for display, including name and index information

#### Data Flow
1. Initial data is prepared using `useMemo` to optimize performance
2. User interactions update local state (selectedYear, selectedMonth)
3. Local state changes trigger updates to the global Recoil state
4. State changes are tracked with Firebase Analytics for user behavior analysis

### Interface

The BabySittingFilters component provides a rich user interface with several interactive elements:

#### Input Controls
- **Year Dropdown**: A select input that displays available years
- **Month Buttons**: A horizontally scrollable list of month buttons
- **Navigation Buttons**: Previous/Next buttons for month navigation (desktop only)

#### Interaction Patterns
- **Direct Selection**: Users can directly select a year from the dropdown or a month from the button list
- **Sequential Navigation**: Users can navigate through months sequentially using the previous/next buttons
- **Cross-Year Navigation**: When navigating past January or December, the component automatically changes the year
- **Automatic Scrolling**: The selected month is automatically scrolled into view and centered

#### Accessibility Features
- **Visible Focus States**: Clear visual indication of focused elements
- **Semantic HTML**: Proper use of buttons and other interactive elements
- **Touch-Friendly**: Large touch targets (44px height) for better mobile usability
- **Keyboard Navigation**: Support for keyboard navigation through tab order

### View

The BabySittingFilters component features a carefully designed visual presentation:

#### Layout Structure
- **Container**: A sticky header container that remains visible when scrolling
- **Two-Part Layout**: Fixed year selector on the left, scrollable month selector on the right
- **Responsive Design**: Adapts to different screen sizes with mobile-specific optimizations

#### Visual Design
- **Theme Integration**: Full support for both light and dark themes
- **Color System**: Uses theme-aware colors with proper contrast ratios
- **Typography**: Consistent text styling with proper capitalization
- **Spacing**: Consistent spacing between elements for visual harmony
- **Visual Hierarchy**: Clear distinction between selected and unselected states

#### Mobile Optimizations
- **Touch Scrolling**: Enhanced touch scrolling with momentum and snap points
- **Gradient Edges**: Gradient mask at the edges to indicate scrollability
- **Adjusted Padding**: Modified spacing for better mobile experience
- **Hidden Navigation Buttons**: Previous/Next buttons are hidden on mobile to save space

### Operations

The BabySittingFilters component supports several key operations:

#### User Actions
- **Select Year**: Change the year filter via dropdown
- **Select Month**: Change the month filter by clicking a month button
- **Navigate Previous**: Move to the previous month (with year change if needed)
- **Navigate Next**: Move to the next month (with year change if needed)

#### System Operations
- **Ensure Visibility**: Automatically scroll to make the selected month visible
- **Window Resize Handling**: Maintain proper scrolling position on window resize
- **Analytics Tracking**: Log user interactions for analytics purposes

#### Key Functions
- **handleSelectYearChange**: Process year selection changes
- **handleMonthButtonClick**: Process month button clicks
- **handlePreviousMonth**: Navigate to the previous month
- **handleNextMonth**: Navigate to the next month
- **ensureSelectedMonthVisible**: Ensure the selected month is visible in the scrollable area

## Technical Implementation

### Component Architecture
The BabySittingFilters component is implemented as a functional React component with hooks for state management and side effects.

### Key Technologies
- **React**: Core UI library
- **TypeScript**: Type safety and developer experience
- **Material-UI**: UI component library
- **Recoil**: State management
- **date-fns**: Date formatting and manipulation
- **Firebase Analytics**: User interaction tracking

### Performance Optimizations
- **useMemo**: Memoization of expensive calculations
- **Efficient Rendering**: Optimized rendering with proper dependency arrays
- **Debounced Scrolling**: Small timeout to ensure DOM is fully rendered before scrolling

### Browser Compatibility
- **Vendor Prefixes**: WebKit-specific properties for iOS support
- **Scrollbar Hiding**: Cross-browser approach to hiding scrollbars
- **Gradient Masks**: Cross-browser implementation of gradient masks

## Functional Description

The BabySittingFilters component serves as a crucial navigation element in the Babysitter Timer application, allowing users to filter their babysitting entries by time period. 

When a user selects a different year or month, the component:
1. Updates the local component state
2. Updates the global application state via Recoil
3. Logs the interaction with Firebase Analytics
4. Ensures the selected month is visible in the scrollable area

The component maintains a consistent user experience across devices by:
- Providing large, touch-friendly controls on mobile
- Offering additional navigation buttons on desktop
- Automatically adjusting the layout based on screen size
- Ensuring the selected filter is always visible

The filter selection affects other components in the application, such as:
- BabySittingList: Shows only entries from the selected time period
- BabySittingStats: Calculates statistics based on the filtered entries

## Usage Example

```tsx
// In a parent component
import BabySittingFilters from './BabySittingFilters';

function ParentComponent() {
  return (
    <div>
      <BabySittingFilters />
      {/* Other components that react to the filter state */}
    </div>
  );
}
```

## Future Enhancements

Potential improvements for the BabySittingFilters component:

1. **Custom Date Range**: Allow filtering by custom date ranges
2. **Filter Presets**: Add quick filter presets like "Last 3 Months", "This Year", etc.
3. **Filter Persistence**: Save filter preferences in local storage
4. **Animation Improvements**: Add subtle animations for state transitions
5. **Keyboard Shortcuts**: Add keyboard shortcuts for navigation
6. **Filter Badges**: Show visual indicators of active filters
7. **Filter Reset**: Add a clear/reset button to return to default filters
