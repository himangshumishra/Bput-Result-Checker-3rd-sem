import React,{ createContext,useState} from "react";

export const StudentContext=createContext()

export const StudentContextProvider=({children})=>{
    const [selectedStudent, setSelectedStudent] = useState(null)
  const [data, setData] = useState([])

    return(
        <StudentContext.Provider value={{data,setData,selectedStudent,setSelectedStudent}}>
            {children}
        </StudentContext.Provider>
    )
}
