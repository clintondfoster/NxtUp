import { useParams } from "react-router-dom"
import Results from "../../pages/Results"

const ResultsCode = () => {
    const {code} = useParams()
  return <Results groupCode={code}/> 
}

export default ResultsCode
