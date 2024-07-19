import React, { useContext, useEffect, useState } from 'react';
import { StudentContext } from '../context/StudentContext';
import { Container, Paper, Typography, IconButton, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import styles from './UniqueStudentResult.module.css';

const UniqueStudentResult = () => {
  const { data, selectedStudent,setSelectedStudent } = useContext(StudentContext);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (selectedStudent && data.length > 0) {
      let studentId = selectedStudent.rollNo % 1000;
      if (studentId === 0) {
        studentId = 100;
      }
      // console.log('Computed studentId:', studentId);
      // console.log(selectedStudent);
// console.log(data.length);
      if (studentId > 0 && studentId <= data.length) {
        const studentData = data[studentId - 1];
        if (studentData[1]) {
          // console.log('Setting subjects:', studentData[1]);
          setSubjects(studentData[1].subjects);
        } else {
          console.log('No valid subjects found, setting empty array');
          setSubjects([]); // No subjects found for this student or invalid structure
        }
      } else {
        console.log('Computed studentId is out of bounds');
        setSubjects([]);
      }
    } else {
      console.log('No selectedStudent or data is empty');
      setSubjects([]);
    }
  }, [selectedStudent, data]); 
  const handleClose = () => {
    setSelectedStudent(null);
  };


  if (!selectedStudent) {
    return <h2 style={{textAlign:'center'}}>Click on View Result To Check Full Result</h2>; 
  }

  // console.log('Subjects before render:', subjects);
  // console.log(Array.isArray(subjects));
  // const subjectsJson = JSON.stringify(subjects);
  // console.log('Subjects JSON:', subjectsJson);
  return (
    <Container className={styles.overlay}  style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <Paper className={styles.card}>
        {/* <IconButton style={{color:'red'}}className={styles.closeButton} onClick={handleClose}> */}
        <div className={styles.closeButton}>

          <CloseIcon onClick={handleClose} />
        </div>
        {/* </IconButton> */}
        <Typography variant="h5" gutterBottom>
          Detailed Result for <br /><span style={{fontWeight:'bolder'}}>{selectedStudent.name}</span>
        </Typography>
        <Typography variant="h5">
          Registration Number: {selectedStudent.rollNo}
        </Typography>
        <p style={{marginTop:'0px', fontWeight:'bold'}}>{selectedStudent.branchName}</p>
          <hr />
        {subjects.length > 0 ? (
       <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{fontWeight:'bolder',fontSize:'larger'}}>Subject Name</TableCell>
                  <TableCell  style={{fontWeight:'bolder',fontSize:'larger'}}>Grade</TableCell>
                  <TableCell  style={{fontWeight:'bolder',fontSize:'larger'}}>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject, index) => (
                  <TableRow key={index}>
                    <TableCell  style={{fontWeight:'bolder',fontSize:'90%'}}>{subject.name}</TableCell>
                    <TableCell style={{fontWeight:'bolder',fontSize:'90%'}}>{subject.grade}</TableCell>
                    <TableCell style={{fontWeight:'bolder',fontSize:'90%'}}>{subject.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div><h3> Total SGPA is {selectedStudent.sgpa}</h3></div>
            <button style={{fontWeight:'bolder',fontSize:'larger', borderRadius:'50px'}} onClick={handleClose}>Close</button>
          </TableContainer>
        ) : (
          <Typography variant="body2">
            No subjects found for this student.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};
export default UniqueStudentResult;
