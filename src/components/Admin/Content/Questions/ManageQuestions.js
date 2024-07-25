import { useState } from 'react';
import Select from 'react-select';
import './ManageQuestions.scss'
import { BiSolidFolderPlus } from "react-icons/bi"
import { BsPatchPlusFill } from "react-icons/bs";
import { BsFillPatchMinusFill } from "react-icons/bs";
import { TbHexagonMinusFilled } from "react-icons/tb";
import { TbHexagonPlusFilled } from "react-icons/tb";
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const ManageQuestions = () => {
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];
    const [selectedQuiz, setSelectedQuiz] = useState({})
    const handleChangeFile = (questionId, event) => {
        let questionClone = _.cloneDeep(questions);
        let index = questionClone.findIndex(item => item.id === questionId)
        if (index > -1 && event.target && event.target.files && event.target.files[0]) {
            questionClone[index].imageFile = event.target.files[0];
            questionClone[index].imageName = event.target.files[0].name;
            setQuestions(questionClone)
        }
    }

    const [questions, setQuestions] = useState([
        {
            id: uuidv4(),
            description: '',
            imageFile: '',
            imageName: '',
            answers: [
                {
                    id: uuidv4(),
                    description: '',
                    isCorrect: false,
                }
            ]
        },
    ])

    const handleAddRemoveQuestion = (type, id) => {
        if (type === 'ADD') {
            const newQuestion =
            {
                id: uuidv4(),
                description: '',
                imageFile: '',
                imageName: '',
                answers: [
                    {
                        id: uuidv4(),
                        description: '',
                        isCorrect: false,
                    }
                ]
            }
            setQuestions([...questions, newQuestion])
        }
        if (type === 'REMOVE') {
            let questionsClone = _.cloneDeep(questions);
            questionsClone = questionsClone.filter(item => item.id !== id)
            setQuestions(questionsClone)
        }
    }

    const handleAddRemoveAnswer = (type, questionId, answerId) => {
        let questionClone = _.cloneDeep(questions);
        let index = questionClone.findIndex(item => item.id === questionId)
        if (index > -1) {
            if (type === 'ADD') {
                const newAnswer =
                {

                    id: uuidv4(),
                    description: '',
                    isCorrect: false,
                }
                // console.log("index: ", index)
                questionClone[index].answers.push(newAnswer)
                setQuestions(questionClone)

            }
            if (type === 'REMOVE') {
                // console.log("questionClone[index]: ", questionClone[index])
                questionClone[index].answers = questionClone[index].answers.filter(item => item.id !== answerId)
                setQuestions(questionClone)
            }
        }
    }
    const handleOnChange = (type, questionId, value) => {
        if (type === 'QUESTION') {
            let questionClone = _.cloneDeep(questions);
            let index = questionClone.findIndex(item => item.id === questionId)
            if (index > -1) {
                questionClone[index].description = value;
                setQuestions(questionClone)
            }
        }
    }
    const handleAnswer = (type, answerId, questionId, event) => {
        let questionClone = _.cloneDeep(questions);
        let indexQuestion = questionClone.findIndex(item => item.id === questionId)
        if (indexQuestion > -1) {

            questionClone[indexQuestion].answers = questionClone[indexQuestion].answers.map(answer => {
                if (answer.id === answerId) {
                    if (type === 'CHECKBOX') {
                        answer.isCorrect = event.target.checked
                    }
                    if (type === 'INPUT') {
                        answer.description = event.target.value
                    }
                }
                return answer
            })
            setQuestions(questionClone)
        }
    }
    const handleSubmitQuestion = () => {
        console.log('questions: ', questions)
    }
    return (
        <div className="questions-container">
            <div className="title">
                Manage Questions
            </div>
            <div className="add-new-questions">
                <div className='col-6 form-group'>
                    <label className='mb-2'>Select Quiz:</label>
                    <Select
                        value={selectedQuiz}
                        onChange={setSelectedQuiz}
                        options={options}
                    />
                </div>
                <div className='mt-3 mb-2'>
                    Add New Question
                </div>
                {
                    questions && questions.length > 0 &&
                    questions.map((item, index) => {
                        return (
                            <div key={`question-id${index}`} className='q-main mb-4'>
                                <div className='question-content d-flex mb-3'>
                                    <div className="form-floating col-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="name@example.com"
                                            value={item.description}
                                            onChange={(event) => handleOnChange('QUESTION', item.id, event.target.value)} />
                                        <label>Question {index + 1}'s description</label>
                                    </div>
                                    <div className='more-actions d-flex'>
                                        <label htmlFor={`${item.id}`} className='label-upload d-flex' >
                                            <BiSolidFolderPlus />
                                        </label>
                                        <span className=''>{item.imageFile ? item.imageName : '0 file is uploaded'}</span>

                                        <input type="file" id={`${item.id}`} hidden onChange={(event) => handleChangeFile(item.id, event)} />

                                    </div>
                                    <div className='btn-add-new-question'>
                                        <span onClick={() => handleAddRemoveQuestion('ADD', '')} className='icon-add'>
                                            <BsPatchPlusFill />
                                        </span>
                                        {questions.length > 1 &&
                                            <span onClick={() => handleAddRemoveQuestion('REMOVE', item.id)} className='icon-remove'>
                                                <BsFillPatchMinusFill />
                                            </span>
                                        }

                                    </div>

                                </div>
                                {item.answers && item.answers.length > 0 &&
                                    item.answers.map((answer, index) => {
                                        return (
                                            <div key={answer.id} className='answer-content mb-3 d-flex col-6'>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="flexCheckDefault"
                                                    checked={answer.isCorrect}
                                                    onChange={(event) => handleAnswer('CHECKBOX', answer.id, item.id, event)}
                                                />
                                                <div className="form-floating answer">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="name@example.com"
                                                        value={answer.description}
                                                        onChange={(event) => handleAnswer('INPUT', answer.id, item.id, event)}
                                                    />
                                                    <label>Answer {index + 1}</label>
                                                </div>
                                                <div className='btn-add-new-question'>
                                                    <span onClick={() => handleAddRemoveAnswer('ADD', item.id, '')} className='icon-add'>
                                                        <TbHexagonPlusFilled />
                                                    </span>
                                                    {
                                                        item.answers.length > 1 &&
                                                        <span onClick={() => handleAddRemoveAnswer('REMOVE', item.id, answer.id)} className='icon-remove'>
                                                            <TbHexagonMinusFilled />
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
                {
                    questions && questions.length > 0 &&
                    <div>
                        <button className='btn btn-warning' onClick={() => handleSubmitQuestion()}>Lưu</button>
                    </div>
                }
            </div>
        </div>
    )


}
export default ManageQuestions