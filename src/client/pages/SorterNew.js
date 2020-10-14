import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { submitNewSorter, clearSubmissionError } from '../store/sorters/sortersActions';
import { Affix, Row, Col, Steps, Form, Button, Space, Typography } from 'antd';
import { red, volcano, orange, gold, yellow, lime, green, cyan, blue, geekblue, purple, magenta } from '@ant-design/colors';
import CreateFormBase from '../components/sorters/CreateFormBase';
import CreateFormGroups from '../components/sorters/CreateFormGroups';
import CreateFormCharacters from '../components/sorters/CreateFormCharacters';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import { validateData } from './../../schema/sorter.schema';
import { sorterFormSchema } from './../../schema/sorter.schema';

const lastStep = 3;
const initialStepStatus = [
    { cur: 'process', prev: '' },
    { cur: 'wait', prev: '' },
    { cur: 'wait', prev: '' },
    { cur: 'wait', prev: '' }
];
const colorOptions = [
    red.primary,
    volcano.primary,
    orange.primary,
    gold.primary,
    yellow.primary,
    lime.primary,
    green.primary,
    cyan.primary,
    blue.primary,
    geekblue.primary,
    purple.primary,
    magenta.primary
];

const SorterNew = ({ submitError, submitNewSorter, clearSubmissionError }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [stepStatus, setStepStatus] = useState(initialStepStatus);
    const stepForms = [...Form.useForm(), ...Form.useForm(), ...Form.useForm()];
    const [charaEditForm] = Form.useForm();
    const [editFormState, setEditFormState] = useState({ index: null, visible: false });
    const [mainFormState, setMainFormState] = useState([]);
    const [formError, setFormError] = useState(false);

    useEffect(() => {
        clearSubmissionError();
    }, []);

    useEffect(() => {
        if (submitError) setFormError(true);
        else setFormError(false);
    }, [submitError]);

    const handleSubmit = () => {
        if (!validateData(mainFormState, sorterFormSchema).errors) submitNewSorter(mainFormState);
        else setFormError(true);
    };

    const handleFormValidation = (form, formValues) => {
        formValues = formValues ?? form.getFieldsValue();
        let fields = formValues ? Object.keys(formValues) : null;

        const { values, errors } = validateData(formValues, sorterFormSchema, fields);
        fields = fields ?? Object.keys(values);

        if (errors) {
            const errorKeys = Object.keys(errors);
            form.setFields(errorKeys.map((key) => ({ name: errors[key].path, errors: errors[key].message })));
            form.setFields(fields.filter((field) => !errorKeys.includes(field)).map((key) => ({ name: key, errors: null })));
            return false;
        } else {
            form.setFields(fields.map((key) => ({ name: key, errors: null })));
            return true;
        }
    };

    const handleStepChange = (current) => {
        if (currentStep === lastStep) {
            setStepStatus((prevState) => ({
                ...prevState,
                [currentStep]: { prev: prevState[currentStep].cur, cur: 'wait' },
                [current]: { prev: prevState[current].cur, cur: 'process' }
            }));
            setCurrentStep(current);
        } else if (stepForms[currentStep]) {
            setMainFormState((prev) => ({ ...prev, ...stepForms[currentStep].getFieldsValue() }));
            if (handleFormValidation(stepForms[currentStep])) {
                setStepStatus((prevState) => ({
                    ...prevState,
                    [currentStep]: { prev: prevState[currentStep].cur, cur: 'finish' },
                    [current]: { prev: prevState[current].cur, cur: 'process' }
                }));
                setCurrentStep(current);
            } else {
                setStepStatus((prevState) => ({
                    ...prevState,
                    [currentStep]: { prev: prevState[currentStep].cur, cur: 'error' },
                    [current]: { prev: prevState[current].cur, cur: 'process' }
                }));
            }
            setCurrentStep(current);
        }
    };

    useEffect(() => {
        if (stepStatus[currentStep].prev === 'error') handleFormValidation(stepForms[currentStep]);
    }, [currentStep]);

    return (
        <>
            <Row style={{ width: '100%' }}>
                <Col span={6}>
                    <Affix>
                        <LayoutBlockWrapper>
                            <Steps current={currentStep} onChange={handleStepChange} direction='vertical'>
                                <Steps.Step
                                    title='Basic Info'
                                    status={stepStatus[0].cur}
                                    description='Sorter title, etc...'
                                />
                                <Steps.Step title='Groups' status={stepStatus[1].cur} description='Add selectable groups' />
                                <Steps.Step
                                    title='Characters'
                                    status={stepStatus[2].cur}
                                    description='Add characters and pictures'
                                />
                                <Steps.Step title='Submit' status={stepStatus[3].cur} description='Review and submit' />
                            </Steps>
                        </LayoutBlockWrapper>
                    </Affix>
                </Col>
                <Col span={18}>
                    <LayoutBlockWrapper>
                        {/*--------------Step 1 - Basic Info--------------*/}
                        {currentStep === 0 && (
                            <CreateFormBase form={stepForms[0]} formName='step1' onValuesChange={handleFormValidation} />
                        )}
                        {/*--------------Step 2 - Groups--------------*/}
                        {currentStep === 1 && (
                            <CreateFormGroups
                                form={stepForms[1]}
                                formName='step2'
                                colors={colorOptions}
                                onValuesChange={handleFormValidation}
                            />
                        )}
                        {/*--------------Step 3 - Characters--------------*/}
                        {currentStep === 2 && (
                            <CreateFormCharacters
                                form={stepForms[2]}
                                formName='step3'
                                groups={(() => {
                                    const groups = stepForms[1].getFieldValue('groups');
                                    return groups != null ? groups.filter((group) => group.name && group.name.length) : [];
                                }).call()}
                                editForm={charaEditForm}
                                editFormState={editFormState}
                                setEditFormState={setEditFormState}
                                onValuesChange={handleFormValidation}
                            />
                        )}
                        {/*--------------Step 4 - Submit--------------*/}
                        {currentStep === 3 && (
                            <>
                                {formError && <div>submission error goes here</div>}
                                <Button type='primary' block onClick={handleSubmit}>
                                    Submit Sorter
                                </Button>
                            </>
                        )}
                    </LayoutBlockWrapper>
                </Col>
            </Row>
        </>
    );
};

const mapStateToProps = (state) => ({
    submitError: state.sorters.submitSorterError
});

const mapDispatchToProps = {
    submitNewSorter,
    clearSubmissionError
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterNew);
