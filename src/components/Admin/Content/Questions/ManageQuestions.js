import { useEffect, useState } from 'react';
import Select from 'react-select';
import './ManageQuestions.scss'
import { BiSolidFolderPlus } from "react-icons/bi"
import { BsPatchPlusFill, BsFillPatchMinusFill } from "react-icons/bs";
import { TbHexagonMinusFilled, TbHexagonPlusFilled } from "react-icons/tb";
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Lightbox from "react-awesome-lightbox";
import { getAllQuiz } from "../../../../services/QuizServices";
import { postCreateNewQuestionForQuiz, postCreateNewAnswerForQuestion } from '../../../../services/QuestionServices';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ManageQuestions = () => {
    const { t } = useTranslation();
    const initQuestion = [
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
        }]
    const [questions, setQuestions] = useState(initQuestion)

    const [isPreviewImage, setIsPreviewImage] = useState(false);

    const [dataImagePreview, setDataImagePreview] = useState({
        title: '',
        url: ','
    })

    const [listQuiz, setListQuiz] = useState([])
    const [selectedQuiz, setSelectedQuiz] = useState({})
    // console.log(selectedQuiz)
    useEffect(() => {
        fetchListQuiz()
    }, [])

    const fetchListQuiz = async () => {
        let res = await getAllQuiz()
        if (res && res.EC === 0) {
            let newQuiz = res.DT.map(item => {
                return {
                    value: item.id,
                    label: `${item.id} - ${item.name}`
                }
            })
            setListQuiz(newQuiz)
            // console.log(res.DT)
        }

    }

    const handleChangeFile = (questionId, event) => {
        let questionClone = _.cloneDeep(questions);
        let index = questionClone.findIndex(item => item.id === questionId)
        if (index > -1 && event.target && event.target.files && event.target.files[0]) {
            questionClone[index].imageFile = event.target.files[0];
            questionClone[index].imageName = event.target.files[0].name;
            setQuestions(questionClone)
        }
    }

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
    const handleSubmitQuestion = async () => {
        // console.log('questions: ', questions, selectedQuiz)
        if (_.isEmpty(selectedQuiz)) {
            toast.error("Please choose a Quiz !")
            return;
        }

        let flag = 1;
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].description || questions[i].description.trim().length === 0) {
                toast.error(`Not Empty at Question ${i + 1}`);
                flag = 0;
                break;
            }
            for (let j = 0; j < questions[i].answers.length; j++) {
                if (!questions[i].answers[j].description || questions[i].answers[j].description.trim().length === 0) {
                    flag = 0
                    toast.error(`Not Empty Answer ${j + 1} at Question ${i + 1}`);
                    break;
                }
            }
            if (flag === 0) break
        }
        if (flag === 0) return;
        for (const question of questions) {
            const q = await postCreateNewQuestionForQuiz(+selectedQuiz.value, question.description, question.imageFile);
            // console.log(">>>check q: ", q);


            for (const answer of question.answers) {
                await postCreateNewAnswerForQuestion(answer.description, answer.isCorrect, q.DT.id);
                // console.log(answer.description, answer.isCorrect, q.DT.id)
                // console.log(">>>check a: ", a);
            };
        }
        toast.success('Create Question and Answer succeed!')
        setQuestions(initQuestion)
    }

    const handlePreviewImage = (questionId) => {
        let questionClone = _.cloneDeep(questions);
        let indexQuestion = questionClone.findIndex(item => item.id === questionId)
        if (indexQuestion > -1) {
            setDataImagePreview({
                url: URL.createObjectURL(questionClone[indexQuestion].imageFile),
                title: questionClone[indexQuestion].imageName
            })
            setIsPreviewImage(true)
        }
    }

    return (
        <div className="questions-container">
            <div className="title">
                {t('Admin.SideBar.manage-question')}
            </div>
            <div className="add-new-questions">
                <div className='col-6 form-group'>
                    <label className='mb-2'>{t('Admin.Manage-Question.Select-quiz')}:</label>
                    <Select
                        value={selectedQuiz}
                        onChange={setSelectedQuiz}
                        options={listQuiz}
                    />
                </div>
                <div className='mt-3 mb-2'>
                    {t('Admin.Manage-Question.Add-qs')}
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
                                        <label>{t('Admin.Manage-Question.Question')} {index + 1}{t('Admin.Manage-Question.Description')}</label>
                                    </div>
                                    <div className='more-actions d-flex'>
                                        <label htmlFor={`${item.id}`} className='label-upload d-flex' >
                                            <BiSolidFolderPlus />
                                        </label>
                                        <span >{item.imageFile ? <span onClick={() => handlePreviewImage(item.id)}> {item.imageName} </span> : `0 ${t('Admin.Manage-Question.Upload')}`}</span>

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
                                                    <label>{t('Admin.Manage-Question.Answer')} {index + 1}</label>
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
                        <button className='btn btn-warning' onClick={() => handleSubmitQuestion()}>{t('Admin.Manage-Question.Save-qs')}</button>
                    </div>
                }
                {
                    isPreviewImage === true && <Lightbox image={dataImagePreview.url} title={dataImagePreview.title} onClose={() => setIsPreviewImage(false)}></Lightbox>
                }
            </div>


        </div>
    )


}
export default ManageQuestions