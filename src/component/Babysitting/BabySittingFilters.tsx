import React, { useMemo, useState } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  ButtonGroup, 
  IconButton, 
  Select, 
  MenuItem, 
  FormControl, 
  Paper,
  Button, // Added Button
  useTheme, // Added useTheme
  useMediaQuery // Added useMediaQuery
} from "@mui/material";
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon, // Added ExpandMoreIcon
  ExpandLess as ExpandLessIcon // Added ExpandLessIcon
} from "@mui/icons-material";
import { lastThreeYears } from "../../utils/dates";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { babysittingFilterState } from "../../recoil/recoil_states";
import { useRecoilState } from "recoil";
import { monthList } from "../../utils/months";
import Buttons from "../Buttons/Buttons";
import { logEvent } from "firebase/analytics";
import { fireBaseAnalytics } from "../../utils/firebase";

function BabySittingFilters() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [showAllMonthsMobile, setShowAllMonthsMobile] = useState(false);

    const years = useMemo(() => lastThreeYears(new Date().getFullYear()).sort((a, b) => a - b), []); // Sort years ascending
    const allMonths: string[] = useMemo(() => monthList, []); // Renamed to allMonths
    const currentMonthIndex = useMemo(() => new Date().getMonth(), []); // Get current month index (0-11)

    const actualMonthString = useMemo(() => { // Renamed to actualMonthString
        return format(new Date(), 'MMMM', { locale: fr })
            .slice(0, 1)
            .toUpperCase()
            .concat(format(new Date(), 'MMMM', { locale: fr }).slice(1));
    }, []);

    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<string>(actualMonthString); // Use renamed variable
    const [filter, setFilter] = useRecoilState(babysittingFilterState);

    // Determine which months to display based on screen size and toggle state
    const displayedMonths = useMemo(() => {
        if (!isMobile) {
            return allMonths.map((month, index) => ({ name: month, originalIndex: index }));
        }
        if (showAllMonthsMobile) {
            return allMonths.map((month, index) => ({ name: month, originalIndex: index }));
        }
        // Calculate indices for current and previous two months
        const prevMonthIndex = (currentMonthIndex - 1 + 12) % 12;
        const prevPrevMonthIndex = (currentMonthIndex - 2 + 12) % 12;
        const initialIndices = [prevPrevMonthIndex, prevMonthIndex, currentMonthIndex].sort((a, b) => a - b); // Sort for consistent order
        
        // Ensure unique indices if current month is Jan or Feb
        const uniqueIndices = Array.from(new Set(initialIndices)); // Convert Set to Array

        return uniqueIndices.map(index => ({ name: allMonths[index], originalIndex: index }));
    }, [isMobile, showAllMonthsMobile, allMonths, currentMonthIndex]);

    function handleSelectYearChange(event: React.ChangeEvent<{ value: unknown }>) {
        logEvent(fireBaseAnalytics, "filter_button_select_year");
        const year = Number(event.target.value);
        setSelectedYear(year);
        setFilter({
            ...filter,
            year: year
        });
    }

    function changeYear(newYear: number) {
        if (years.includes(newYear)) {
            logEvent(fireBaseAnalytics, "filter_button_change_year");
            setSelectedYear(newYear);
            setFilter({
                ...filter,
                year: newYear
            });
        }
    }

    function handleMonthButtonClick(monthString: string, monthNumber: number) {
        logEvent(fireBaseAnalytics, "filter_button_select_month");
        setSelectedMonth(monthString);
        setFilter({
            ...filter,
            month: monthNumber
        });
    }

    return (
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ pb: 3 }}>
                <Typography variant="h5" component="h2" fontWeight="bold" mb={2}>
                    Filtres
                </Typography>
                
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 3, 
                        mb: 2, 
                        bgcolor: 'primary.lighter', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'primary.light'
                    }}
                >
                    <Box mb={3}>
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} mb={1}>
                            <Typography 
                                component="label" 
                                fontWeight="medium" 
                                color="text.secondary" 
                                sx={{ 
                                    mb: { xs: 1, sm: 0 }, 
                                    mr: { sm: 2 } 
                                }}
                            >
                                Année :
                            </Typography>
                            
                            <Box display="flex" alignItems="center" height={40}>
                                <ButtonGroup variant="contained" aria-label="Sélection d'année">
                                    <IconButton
                                        onClick={() => changeYear(selectedYear - 1)}
                                        disabled={selectedYear <= years[0]}
                                        size="small"
                                        sx={{ 
                                            borderRadius: '4px 0 0 4px',
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
                                        }}
                                        aria-label="Année précédente"
                                    >
                                        <ChevronLeftIcon fontSize="small" />
                                    </IconButton>
                                    
                                    <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
                                        <Select
                                            value={selectedYear}
                                            onChange={handleSelectYearChange as any}
                                            sx={{ 
                                                borderRadius: 0,
                                                bgcolor: 'background.paper',
                                                color: 'primary.main',
                                                fontWeight: 'medium',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                    borderLeft: 0,
                                                    borderRight: 0
                                                }
                                            }}
                                        >
                                            {years.map((year, index: number) => (
                                                <MenuItem key={`${year}-${index}`} value={year}>{year}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    
                                    <IconButton
                                        onClick={() => changeYear(selectedYear + 1)}
                                        disabled={selectedYear >= years[years.length - 1]}
                                        size="small"
                                        sx={{ 
                                            borderRadius: '0 4px 4px 0',
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
                                        }}
                                        aria-label="Année suivante"
                                    >
                                        <ChevronRightIcon fontSize="small" />
                                    </IconButton>
                                </ButtonGroup>
                            </Box>
                        </Box>
                    </Box>
                    
                    {/* Month Selection Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' }, gap: 1 }}>
                        {displayedMonths.map(({ name: month, originalIndex }) => (
                            <Box key={`${month}-${originalIndex}`}>
                                <Buttons
                                    label={month}
                                    clickFunction={() => handleMonthButtonClick(month, originalIndex + 1)} // Use originalIndex
                                    type={month === selectedMonth ? "selected" : "standard"}
                                    size="medium"
                                    smallText={month.length > 7}
                                    fullWidth // Make button take full width of grid item
                                />
                            </Box>
                        ))}
                    </Box>

                    {/* Toggle Button for Mobile */}
                    {isMobile && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                onClick={() => setShowAllMonthsMobile(!showAllMonthsMobile)}
                                startIcon={showAllMonthsMobile ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                size="small"
                            >
                                {showAllMonthsMobile ? "Voir moins" : "Voir plus"}
                            </Button>
                        </Box>
                    )}
                </Paper>
            </CardContent>
        </Card>
    );
}

export default BabySittingFilters;
