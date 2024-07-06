import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Container,
  CircularProgress,
  Alert,
  TableSortLabel,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import styles from './Results.module.css';
import { StudentContext } from "./context/StudentContext";

const Results = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchInput, setSearchInput] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { setData, setSelectedStudent } = useContext(StudentContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://raw.githubusercontent.com/bhaluop/JSON-Store/main/data.json");
        const data = response.data;
        setData(data);
        const flattenedData = data
          .filter(item => Array.isArray(item))
          .flat()
          .filter(student => student.rollNo);
        setStudents(flattenedData);
        setFilteredStudents(flattenedData); 
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setData]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setSearchInput(value);
    filterStudents(value);
  };

  const filterStudents = (query) => {
    const filtered = students.filter(student => {
      return (
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredStudents(filtered);
  };

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortField === "rollNo") {
      return sortOrder === "asc" ? a.rollNo.localeCompare(b.rollNo) : b.rollNo.localeCompare(a.rollNo);
    } else if (sortField === "sgpa") {
      const sgpaA = a.sgpa ?? -Infinity;
      const sgpaB = b.sgpa ?? -Infinity;
      return sortOrder === "asc" ? sgpaA - sgpaB : sgpaB - sgpaA;
    }
    return 0;
  });

  if (loading) {
    return (
      <Container className={styles.fullScreenContainer}>
        <div style={{ marginTop: '25%',marginLeft:'45%' }}>
          <CircularProgress style={{textAlign:'center'}} size={69} />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={styles.fullScreenContainer}>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className={styles.fullScreenContainer}>
      <Typography variant="h4" gutterBottom className={styles.h4Typography}style={{fontWeight:'bold'}}>
        Student Results-4th Sem
      </Typography>
      <TextField
      style={{backgroundColor:'#e3e5ff'}}
        label="Search by name or Registration number"
        placeholder="Enter Here"
        variant="outlined"
        value={searchInput}
        onChange={handleSearchInputChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton disabled>
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
        className={styles.searchField}
      />
      <TableContainer component={Paper} className={styles.styledTableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === "rollNo"}
                  direction={sortField === "rollNo" ? sortOrder : "asc"}
                  onClick={() => handleSort("rollNo")}
                  classes={{ root: styles.sortLabel, icon: styles.icon }}
                >
                Registration Number
                </TableSortLabel>
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "sgpa"}
                  direction={sortField === "sgpa" ? sortOrder : "asc"}
                  onClick={() => handleSort("sgpa")}
                  classes={{ root: styles.sortLabel, icon: styles.icon }}
                >
                  SGPA
                </TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStudents.length > 0 ? (
              sortedStudents.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.sgpa ?? "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      className={styles.styledButton}
                      onClick={() => setSelectedStudent(student)}
                    >
                      View Result
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No matching students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Results;
