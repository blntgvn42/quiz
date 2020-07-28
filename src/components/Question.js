import React from 'react'

import { Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel } from "@material-ui/core"

function Question({ index, question, correctAnswer, incorrectAnswers, ...props }) {
    return (
        <Card className="app__card">
            <CardContent>
                <Typography color="textSecondary" gutterBottom>Question {index + 1}</Typography>
                <Typography variant="h5" component="h2">
                    <div dangerouslySetInnerHTML={{ __html: question }}></div>
                </Typography>
            </CardContent>
            <CardContent>
                <RadioGroup>
                    <FormControlLabel value={correctAnswer} label={correctAnswer} labelPlacement="end" control={<Radio />} onChange={props.onChange} />
                    {
                        incorrectAnswers.map((incorrectAnswer, indexInner) =>
                            <FormControlLabel key={indexInner} value={incorrectAnswer} label={incorrectAnswer} labelPlacement="end" control={<Radio />} onChange={props.onChange} />
                        )
                    }
                </RadioGroup>
            </CardContent>
        </Card>
    )
}

export default Question
