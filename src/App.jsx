import Results from './components/Results'
import './App.css'
import UniqueStudentResult from './components/studentResult/UniqueStudentResult'
import { StudentContextProvider } from './components/context/StudentContext'

function App() {

  return (
   <>
   <StudentContextProvider>
   <Results/>
   <UniqueStudentResult/>

   </StudentContextProvider>
   </>
  )
}

export default App
