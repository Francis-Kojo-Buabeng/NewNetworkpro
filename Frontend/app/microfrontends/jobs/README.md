# Jobs Microfrontend

This directory contains the modular jobs functionality for the NetworkPro app.

## Structure

```
jobs/
├── JobsScreen.tsx          # Main jobs screen component
├── components/             # Modular components directory
│   ├── index.ts           # Component exports
│   ├── JobCard.tsx        # Individual job card component
│   ├── FilterChip.tsx     # Filter chip component
│   ├── JobFilters.tsx     # Filters section component
│   ├── JobSearchHeader.tsx # Search header component
│   └── CompanyModal.tsx   # Company profile modal component
└── README.md              # This documentation
```

## Components

### JobCard
- **Purpose**: Displays individual job listings with company info, requirements, and action buttons
- **Props**: `job`, `onPress`, `onCompanyPress`, `onSaveToggle`, `onApply`
- **Features**: 
  - Company logo and info
  - Job title, location, salary
  - Job type badge and posted date
  - Requirements tags (shows first 4, with "+X more" indicator)
  - Apply and Save buttons
  - Bookmark functionality

### FilterChip
- **Purpose**: Reusable filter chip component for job types and locations
- **Props**: `label`, `isSelected`, `onPress`
- **Features**: 
  - Selected/unselected states
  - Theme-aware styling
  - Touch feedback

### JobFilters
- **Purpose**: Complete filters section with job types and locations
- **Props**: `jobTypes`, `locations`, `selectedJobType`, `selectedLocation`, `onJobTypeChange`, `onLocationChange`
- **Features**:
  - Horizontal scrollable filter chips
  - Job type and location filtering
  - Uses FilterChip components

### JobSearchHeader
- **Purpose**: Search header with profile button and filter toggle
- **Props**: `searchQuery`, `onSearchChange`, `onFilterToggle`, `onProfilePress`, `userAvatar`, `showFilters`
- **Features**:
  - User profile picture
  - Search input with briefcase icon
  - Filter toggle button with visual feedback
  - Theme-aware styling

### CompanyModal
- **Purpose**: Full-screen modal displaying company profile information
- **Props**: `visible`, `onClose`, `company`
- **Features**:
  - Company header with logo and basic info
  - Company statistics (active jobs, employees, revenue)
  - About section with company description
  - Specialties tags
  - Benefits list with checkmarks
  - Recent jobs list
  - Responsive design with proper scrolling

## Usage

```tsx
import {
  JobCard,
  FilterChip,
  JobFilters,
  JobSearchHeader,
  CompanyModal,
  Job,
  CompanyProfile
} from './components';

// Use components in your screen
<JobSearchHeader
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  onFilterToggle={() => setShowFilters(!showFilters)}
  onProfilePress={handleProfilePress}
  userAvatar={userAvatar}
  showFilters={showFilters}
/>

<JobFilters
  jobTypes={jobTypes}
  locations={locations}
  selectedJobType={selectedJobType}
  selectedLocation={selectedLocation}
  onJobTypeChange={setSelectedJobType}
  onLocationChange={setSelectedLocation}
/>

<JobCard
  job={job}
  onCompanyPress={handleCompanyPress}
  onSaveToggle={toggleSaveJob}
  onApply={handleApply}
/>
```

## Benefits of Modularization

1. **Reusability**: Components can be used across different screens
2. **Maintainability**: Each component has a single responsibility
3. **Testability**: Individual components can be tested in isolation
4. **Scalability**: Easy to add new features or modify existing ones
5. **Code Organization**: Clear separation of concerns
6. **Type Safety**: Proper TypeScript interfaces for all components

## Data Types

### Job
```tsx
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  postedDate: string;
  logo: any;
  description: string;
  requirements: string[];
  isSaved: boolean;
}
```

### CompanyProfile
```tsx
interface CompanyProfile {
  id: string;
  name: string;
  logo: any;
  industry: string;
  size: string;
  location: string;
  founded: string;
  description: string;
  website: string;
  activeJobs: number;
  employeeCount: string;
  revenue: string;
  specialties: string[];
  benefits: string[];
  recentJobs: Job[];
}
```

## Theme Integration

All components use the `useCurrentTheme` hook for consistent theming across light and dark modes. Components automatically adapt their colors based on the current theme. 