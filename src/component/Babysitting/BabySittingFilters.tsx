import React, { useMemo, useState, useEffect } from "react";
import { 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  Button,
  useTheme,
  useMediaQuery,
  Container,
  alpha
} from "@mui/material";
import { 
  KeyboardArrowDown as ArrowDownIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  FilterList as FilterIcon
} from "@mui/icons-material";
import { lastThreeYears } from "../../utils/dates";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { babysittingFilterState } from "../../recoil/recoil_states";
import { useRecoilState } from "recoil";
import { monthList } from "../../utils/months";
import { logEvent } from "firebase/analytics";
import { fireBaseAnalytics } from "../../utils/firebase";

function BabySittingFilters() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const years = useMemo(() => lastThreeYears(new Date().getFullYear()).sort((a, b) => a - b), []); // Sort years ascending
    const allMonths: string[] = useMemo(() => monthList, []); // Renamed to allMonths
    
    // Get current month name
    const actualMonthString = useMemo(() => { // Renamed to actualMonthString
        return format(new Date(), 'MMMM', { locale: fr })
            .slice(0, 1)
            .toUpperCase()
            .concat(format(new Date(), 'MMMM', { locale: fr }).slice(1));
    }, []);

    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<string>(actualMonthString); // Use renamed variable
    const [filter, setFilter] = useRecoilState(babysittingFilterState);

    // Get the index of the currently selected month
    const selectedMonthIndex = useMemo(() => {
        return allMonths.findIndex(month => month === selectedMonth);
    }, [allMonths, selectedMonth]);

    // Always display all months
    const displayedMonths = useMemo(() => {
        return allMonths.map((month, index) => ({ 
            name: month, 
            originalIndex: index 
        }));
    }, [allMonths]);

    function handleSelectYearChange(event: React.ChangeEvent<{ value: unknown }>) {
        logEvent(fireBaseAnalytics, "filter_button_select_year");
        const year = Number(event.target.value);
        setSelectedYear(year);
        setFilter({
            ...filter,
            year: year
        });
    }

    function handleMonthButtonClick(monthString: string, monthNumber: number) {
        logEvent(fireBaseAnalytics, "filter_button_select_month");
        setSelectedMonth(monthString);
        setFilter({
            ...filter,
            month: monthNumber
        });
    }

    // Navigate to previous month
    function handlePreviousMonth() {
        logEvent(fireBaseAnalytics, "filter_button_previous_month");
        const currentMonthIndex = allMonths.findIndex(month => month === selectedMonth);
        if (currentMonthIndex > 0) {
            // Go to previous month in same year
            const prevMonth = allMonths[currentMonthIndex - 1];
            handleMonthButtonClick(prevMonth, currentMonthIndex);
        } else {
            // Go to December of previous year
            if (selectedYear > years[0]) {
                const prevYear = selectedYear - 1;
                const prevMonth = allMonths[11]; // December
                setSelectedYear(prevYear);
                setFilter({
                    ...filter,
                    year: prevYear,
                    month: 12
                });
                setSelectedMonth(prevMonth);
            }
        }
    }

    // Navigate to next month
    function handleNextMonth() {
        logEvent(fireBaseAnalytics, "filter_button_next_month");
        const currentMonthIndex = allMonths.findIndex(month => month === selectedMonth);
        if (currentMonthIndex < 11) {
            // Go to next month in same year
            const nextMonth = allMonths[currentMonthIndex + 1];
            handleMonthButtonClick(nextMonth, currentMonthIndex + 2);
        } else {
            // Go to January of next year
            if (selectedYear < years[years.length - 1]) {
                const nextYear = selectedYear + 1;
                const nextMonth = allMonths[0]; // January
                setSelectedYear(nextYear);
                setFilter({
                    ...filter,
                    year: nextYear,
                    month: 1
                });
                setSelectedMonth(nextMonth);
            }
        }
    }

    // Effect to scroll to selected month when it changes
    useEffect(() => {
        if (isMobile) {
            // Find the selected month button element
            const selectedButton = document.getElementById(`month-button-${selectedMonthIndex}`);
            if (selectedButton) {
                // Get the parent scrollable container
                const scrollContainer = selectedButton.parentElement;
                if (scrollContainer) {
                    // Calculate position to center the selected month
                    const containerWidth = scrollContainer.offsetWidth;
                    const buttonLeft = selectedButton.offsetLeft;
                    const buttonWidth = selectedButton.offsetWidth;
                    const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
                    
                    // Smooth scroll to the position
                    scrollContainer.scrollTo({
                        left: scrollPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }, [selectedMonth, selectedMonthIndex, isMobile]);

    return (
        <Box 
            sx={{ 
                height: { xs: 64, md: 64 }, // Taller height for better touch targets
                bgcolor: theme.palette.mode === 'dark' 
                    ? 'rgba(18, 24, 38, 0.95)' // Dark mode background
                    : 'rgba(255, 255, 255, 0.95)', // Light mode background
                position: 'sticky',
                top: 0, // Stick to the top with no offset
                zIndex: 9,
                boxShadow: 2,
                mb: 2, // Add small margin bottom to match spacing
                py: 1.5,
                marginTop: 0, // Ensure no gap at the top
                marginLeft: 0, // Ensure no gap on the left
                marginRight: 0, // Ensure no gap on the right
                width: '100%', // Ensure full width
                padding: 0, // Remove any padding that might create gaps
                borderBottom: theme.palette.mode === 'light' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none' // Add subtle border in light mode
            }}
        >
            <Container 
                maxWidth="lg" 
                sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', // Center vertically
                    paddingLeft: { xs: 0, sm: 2 }, // Remove padding on mobile
                    paddingRight: { xs: 0, sm: 2 } // Remove padding on mobile
                }}
            >
                {/* Two-part layout: Fixed Year + Scrollable Months */}
                <Box 
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        gap: 1.5
                    }}
                >
                    {/* Filter Icon - Not styled as a button */}
                    <Box 
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 44,
                            height: 44,
                            color: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.7)' 
                                : 'rgba(15, 23, 42, 0.7)',
                            ml: { xs: 1, sm: 0 }
                        }}
                    >
                        <FilterIcon fontSize="small" />
                    </Box>
                    
                    {/* Year Dropdown - Fixed position */}
                    <Box sx={{ 
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <FormControl 
                            size="small" 
                            sx={{ 
                                minWidth: 110,
                                height: 44
                            }}
                        >
                            <Select
                                value={selectedYear}
                                onChange={handleSelectYearChange as any}
                                displayEmpty
                                IconComponent={ArrowDownIcon}
                                sx={{ 
                                    height: '100%',
                                    bgcolor: theme.palette.mode === 'dark' 
                                        ? 'rgba(30, 41, 59, 0.8)' 
                                        : 'rgba(226, 232, 240, 0.8)', // Light gray for light mode
                                    color: theme.palette.mode === 'dark' ? 'white' : 'rgba(15, 23, 42, 0.8)', // Dark text for light mode
                                    borderRadius: 2,
                                    fontWeight: 'medium',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.mode === 'dark'
                                            ? 'rgba(59, 130, 246, 0.3)'
                                            : 'rgba(59, 130, 246, 0.2)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.mode === 'dark'
                                            ? 'rgba(59, 130, 246, 0.5)'
                                            : 'rgba(59, 130, 246, 0.4)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.mode === 'dark'
                                            ? 'rgba(59, 130, 246, 0.7)'
                                            : 'rgba(59, 130, 246, 0.6)',
                                    },
                                    '& .MuiSelect-select': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        px: 1.5
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.7)'
                                            : 'rgba(15, 23, 42, 0.7)',
                                        right: 8
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            bgcolor: theme.palette.mode === 'dark'
                                                ? 'rgba(30, 41, 59, 0.95)'
                                                : 'rgba(255, 255, 255, 0.95)',
                                            color: theme.palette.mode === 'dark' ? 'white' : 'rgba(15, 23, 42, 0.8)',
                                            '& .MuiMenuItem-root': {
                                                '&:hover': {
                                                    bgcolor: theme.palette.mode === 'dark'
                                                        ? 'rgba(59, 130, 246, 0.2)'
                                                        : 'rgba(59, 130, 246, 0.1)',
                                                },
                                                '&.Mui-selected': {
                                                    bgcolor: theme.palette.mode === 'dark'
                                                        ? 'rgba(59, 130, 246, 0.3)'
                                                        : 'rgba(59, 130, 246, 0.15)',
                                                    '&:hover': {
                                                        bgcolor: theme.palette.mode === 'dark'
                                                            ? 'rgba(59, 130, 246, 0.4)'
                                                            : 'rgba(59, 130, 246, 0.25)',
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }}
                            >
                                {years.map((year, index: number) => (
                                    <MenuItem key={`${year}-${index}`} value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    
                    {/* Month Navigation and Selection - Scrollable */}
                    <Box 
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flex: 1,
                            overflow: 'hidden' // Prevent horizontal overflow
                        }}
                    >
                        {/* Previous Month Button - Only visible on desktop */}
                        <Button
                            variant="contained"
                            onClick={handlePreviousMonth}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                minWidth: 'auto',
                                width: 44,
                                height: 44,
                                p: 0,
                                borderRadius: 2,
                                bgcolor: theme.palette.mode === 'dark' 
                                    ? 'rgba(30, 41, 59, 0.8)' 
                                    : 'rgba(226, 232, 240, 0.8)', // Light gray for light mode
                                color: theme.palette.mode === 'dark' ? 'white' : 'rgba(15, 23, 42, 0.8)', // Dark text for light mode
                                '&:hover': {
                                    bgcolor: theme.palette.mode === 'dark' 
                                        ? 'rgba(30, 41, 59, 0.9)' 
                                        : 'rgba(226, 232, 240, 0.9)',
                                }
                            }}
                        >
                            <NavigateBeforeIcon />
                        </Button>
                        
                        {/* Month Selection - Horizontal Scrollable with improved touch scrolling */}
                        <Box 
                            sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                overflowX: 'auto',
                                flex: 1,
                                WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
                                scrollSnapType: { xs: 'x mandatory', md: 'none' }, // Snap to items on mobile
                                px: { xs: 2, md: 0 }, // Add padding on mobile for better UX
                                mx: { xs: -2, md: 0 }, // Compensate for padding
                                maskImage: { 
                                    xs: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', 
                                    md: 'none' 
                                }, // Show partial buttons at edges on mobile to indicate scrollability
                                WebkitMaskImage: { 
                                    xs: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', 
                                    md: 'none' 
                                }, // For Safari support
                                '&::-webkit-scrollbar': {
                                    display: 'none'
                                },
                                msOverflowStyle: 'none',
                                scrollbarWidth: 'none'
                            }}
                        >
                        {displayedMonths.map(({ name: month, originalIndex }) => {
                            const isSelected = month === selectedMonth;
                            return (
                                <Button
                                    id={`month-button-${originalIndex}`}
                                    key={`${month}-${originalIndex}`}
                                    variant="contained"
                                    onClick={() => handleMonthButtonClick(month, originalIndex + 1)}
                                    sx={{
                                        minWidth: 'auto',
                                        height: 44,
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 'medium',
                                        bgcolor: isSelected 
                                            ? 'primary.main' 
                                            : theme.palette.mode === 'dark'
                                                ? alpha(theme.palette.primary.main, 0.15)
                                                : alpha(theme.palette.primary.main, 0.1),
                                        color: isSelected 
                                            ? 'white' 
                                            : theme.palette.mode === 'dark'
                                                ? alpha(theme.palette.common.white, 0.8)
                                                : alpha(theme.palette.primary.main, 0.8),
                                        '&:hover': {
                                            bgcolor: isSelected 
                                                ? 'primary.dark' 
                                                : theme.palette.mode === 'dark'
                                                    ? alpha(theme.palette.primary.main, 0.25)
                                                    : alpha(theme.palette.primary.main, 0.2),
                                        },
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        scrollSnapAlign: 'center' // For better snap scrolling on mobile
                                    }}
                                >
                                    {month.substring(0, 3)}
                                </Button>
                            );
                        })}
                        </Box>
                        
                        {/* Next Month Button - Only visible on desktop */}
                        <Button
                            variant="contained"
                            onClick={handleNextMonth}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                minWidth: 'auto',
                                width: 44,
                                height: 44,
                                p: 0,
                                borderRadius: 2,
                                bgcolor: theme.palette.mode === 'dark' 
                                    ? 'rgba(30, 41, 59, 0.8)' 
                                    : 'rgba(226, 232, 240, 0.8)', // Light gray for light mode
                                color: theme.palette.mode === 'dark' ? 'white' : 'rgba(15, 23, 42, 0.8)', // Dark text for light mode
                                '&:hover': {
                                    bgcolor: theme.palette.mode === 'dark' 
                                        ? 'rgba(30, 41, 59, 0.9)' 
                                        : 'rgba(226, 232, 240, 0.9)',
                                }
                            }}
                        >
                            <NavigateNextIcon />
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default BabySittingFilters;
