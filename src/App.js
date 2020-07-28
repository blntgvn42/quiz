import React, { useState } from 'react'

import { TextField, Button, CircularProgress, Grid } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { Done } from "@material-ui/icons"

import './App.css'
import "awesome-react-steps/lib/css/arrows.css"
import axios from './axios'
import Dropdown from './components/Dropdown'
import Question from './components/Question'

function App() {
  const [totalQuestion, setTotalQuestion] = useState(10)

  const categories = [
    { key: "any", value: "Any Category" }, { key: "9", value: "General Knowledge" }, { key: "10", value: "Entertainment: Books" }, { key: "11", value: "Entertainment: Film" },
    { key: "12", value: "Entertainment: Music" }, { key: "13", value: "Entertainment: Musicals & Theatres" }, { key: "14", value: "Entertainment: Television" }, { key: "15", value: "Entertainment: Video Games" },
    { key: "16", value: "Entertainment: Board Games" }, { key: "17", value: "Science & Nature" }, { key: "18", value: "Science: Computers" }, { key: "19", value: "Science: Mathematics" },
    { key: "20", value: "Mythology" }, { key: "21", value: "Sports" }, { key: "22", value: "Geography" }, { key: "23", value: "History" }, { key: "24", value: "Politics" }, { key: "25", value: "Art" },
    { key: "26", value: "Celebrities" }, { key: "27", value: "Animals" }, { key: "28", value: "Vehicles" }, { key: "29", value: "Entertainment: Comics" },
    { key: "30", value: "Science: Gadgets" }, { key: "31", value: "Entertainment: Japanese Anime & Manga" }, { key: "32", value: "Entertainment: Cartoon & Animation" }
  ]
  const [selectedCategory, setSelectedCategory] = useState("any")

  const difficulties = [{ key: "any", value: "Any Type" }, { key: "easy", value: "Easy" }, { key: "medium", value: "Medium" }, { key: "hard", value: "Hard" }]
  const [selectedDifficulty, setSelectedDifficulty] = useState("any")

  const types = [{ key: "any", value: "Any Type" }, { key: "multiple", value: "Multiple" }, { key: "boolean", value: "True / False" }]
  const [selectedType, setSelectedType] = useState("any")

  const [questions, setQuestions] = useState([])

  const [allQuestionAnswered, setAllQuestionAnswered] = useState(true)

  const [answers, setAnswers] = useState([])

  const [totalPoint, setTotalPoint] = useState(0)

  const pointPerQuestion = 100 / totalQuestion

  const [questionsRetrieved, setQuestionsRetrived] = useState(false)

  const [loading, setLoading] = useState(false)

  const handleCategoryChange = (event) => setSelectedCategory(event.target.value)
  const handleDifficultyChange = (event) => setSelectedDifficulty(event.target.value)
  const handleTypeChange = (event) => setSelectedType(event.target.value)
  const handleTotalQuestionChange = (event) => setTotalQuestion(Number(event.target.value))
  const handleQuestionRetrieve = async () => {
    if (totalQuestion === "" || totalQuestion === 0) return
    await axios.get("/", {
      params: {
        amount: totalQuestion, category: selectedCategory === "any" ? "" : selectedCategory, difficulty: selectedDifficulty === "any" ? "" : selectedDifficulty, type: selectedType === "any" ? "" : selectedType
      }
    })
      .then(response => response.data.results)
      .then(renderedQuestions => {
        console.log(renderedQuestions)
        setLoading(false)
        setQuestionsRetrived(true)
        setQuestions(renderedQuestions)
        setTotalPoint(0)
        let answerSheet = []
        renderedQuestions.forEach(({ correct_answer }, index) => answerSheet.push({ id: index, correctAnswer: correct_answer, userAnswer: "" }))
        setAnswers(answerSheet)
      })
  }
  const handleGoBack = () => {
    setQuestions([])
    setLoading(false)
    setQuestionsRetrived(false)
  }
  const handleAnswerQuestion = (index, value) => answers[index].userAnswer = value
  const handleAnswerSubmit = () => {
    let answeredQuestions = [], totalAnsweredQuestions = 0
    answers.forEach(({ userAnswer }) => answeredQuestions.push(userAnswer === "" ? "empty question" : "non-empyt question"))
    answeredQuestions.forEach(question => question !== "empty question" ? totalAnsweredQuestions++ : null)
    if (totalAnsweredQuestions < totalQuestion) {
      setAllQuestionAnswered(false)
      return
    }
    answers.forEach(({ correctAnswer, userAnswer }) => (correctAnswer === userAnswer) ? setTotalPoint(prevState => prevState + pointPerQuestion) : null)
    handleGoBack()
  }

  return (
    <div className="app">
      <div className="app__header">
        <h1 className="text-align-center">Welcome to the Quiz</h1>
        <Button className="app__goBack" variant="contained" color="secondary" onClick={handleGoBack}>Go Back</Button>
      </div>
      {totalPoint !== 0
        ? (<div className="app__point"><Done className="mr" />You get totally <span className="app__score"> {totalPoint} </span> point</div>)
        : (
          !questionsRetrieved
            ? (<div className="app__point my text-align-center">This project doesnt store data permanantly.<br />The only purpose is to learn React.js and how axios works</div>)
            : ("")
        )
      }
      <div className={`app__information ${questionsRetrieved ? "questions-ready" : "questions-not-ready"}`}>
        <div className="app__selections">
          <Dropdown title="Select Category" selected={selectedCategory} list={categories} onChange={handleCategoryChange} />
          <Dropdown title="Select Difficulty" selected={selectedDifficulty} list={difficulties} onChange={handleDifficultyChange} />
          <Dropdown title="Select Question Type" selected={selectedType} list={types} onChange={handleTypeChange} />
        </div>
        <div className="app__input">
          <TextField fullWidth type="number" variant="outlined" value={totalQuestion} label="How many questions do you want?" onChange={handleTotalQuestionChange} />
        </div>
        <div className="app__submit">
          <Button className="app__getQuestions" variant="contained" color="secondary" onClick={handleQuestionRetrieve}>Get Question</Button>
        </div>

        {loading ? (<div className="app__progressBar"><CircularProgress color="secondary" /><div>Questions are being retrieved</div></div>) : ("")}
      </div>

      {!allQuestionAnswered ? (<Alert className="mb" severity="warning">Please Answer all the Question</Alert>) : ("")}
      {
        questionsRetrieved ? (
          <div>
            <Grid container spacing={3}>
              {questions && (
                questions.map(({ question, correct_answer, incorrect_answers }, index) => (
                  <Grid key={index} item xs={12} sm={12} md={6} height="100%">
                    <Question index={index} question={question} correctAnswer={correct_answer} incorrectAnswers={incorrect_answers} onChange={e => handleAnswerQuestion(index, e.target.value)} />
                  </Grid>
                )))}
            </Grid>
            <Button className="app__sendAnswers" variant="contained" color="secondary" fullWidth onClick={handleAnswerSubmit}>Answer</Button>
          </div>
        ) : ("")
      }
    </div >
  );
}

export default App;