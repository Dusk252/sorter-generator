import React, { useState, useEffect } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { submitNewSorter, updateSorterDraft } from '../store/sorters/sortersActions';
import { submissionStatus } from '../store/sorters/sortersReducer';
import { Affix, Row, Col, Steps, Form, Button, Space } from 'antd';
import { red, volcano, orange, gold, yellow, lime, green, cyan, blue, geekblue, purple, magenta } from '@ant-design/colors';
import CreateFormBase from '../components/sorters/CreateFormBase';
import CreateFormGroups from '../components/sorters/CreateFormGroups';
import CreateFormItems from '../components/sorters/CreateFormItems';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import BoxWrapper from './../components/general/BoxWrapper';
import SorterItemListing from './../components/sorters/SorterItemListing';
import { validateData } from './../../schema/clientValidation';
import { sorterFormSchema } from './../../schema/sorter.schema';
import { get } from 'idb-keyval';

const STORAGE_KEY = 'NEW_SORTER_DRAFT';

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

const SorterNew = ({ status, idbStore, submitNewSorter, updateSorterDraft, history }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [stepStatus, setStepStatus] = useState(initialStepStatus);
    const stepForms = [...Form.useForm(), ...Form.useForm(), ...Form.useForm()];
    const [charaEditForm] = Form.useForm();
    const [editFormState, setEditFormState] = useState({ index: null, visible: false });
    const [formError, setFormError] = useState(null);
    const [loadDraftInfo, setLoadDraftInfo] = useState(null);
    const [loadingDraft, setLoadingDraft] = useState(false);
    const [mainFormState, setMainFormState] = useState([]);

    useEffect(() => {
        get(STORAGE_KEY, idbStore)
            .then((initialState) => {
                if (initialState && initialState.submissionForm && Array.isArray(initialState.submissionForm)) {
                    setLoadDraftInfo(initialState.submissionForm);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (currentStep === lastStep && status === submissionStatus.SUCCESS) history.push('/sorters');
    }, [status]);

    useEffect(() => {
        if (stepStatus[currentStep].prev === 'error') handleFormValidation(stepForms[currentStep]);
    }, [currentStep]);

    useEffect(() => {
        if (loadingDraft) {
            if (loadDraftInfo) {
                let newSubmissionState = [];
                for (let i in stepForms) {
                    if (loadDraftInfo[i]) {
                        stepForms[i].setFieldsValue(loadDraftInfo[i]);
                        newSubmissionState.push(loadDraftInfo[i]);
                    } else newSubmissionState.push(null);
                }
                setMainFormState(newSubmissionState);
                setLoadDraftInfo(null);
            }
            setLoadingDraft(false);
        }
    }, [loadingDraft]);

    const updateForm = (currentStep, formValues) => {
        setMainFormState((currentState) => {
            const newState = Object.assign([], currentState, { [currentStep]: formValues });
            updateSorterDraft(newState);
            return newState;
        });
    };

    const handleLoadDraft = () => {
        setLoadingDraft(true);
    };

    const handleSubmit = () => {
        const finalForm = mainFormState.reduce((acc, value) => ({ ...acc, ...value }), {});
        const validatedData = validateData(finalForm, sorterFormSchema, null, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
            context: finalForm != null && finalForm.groups != null ? { groupLen: finalForm.groups.length } : {}
        });
        if (!validatedData.errors) {
            submitNewSorter(validatedData.values);
        } else {
            setFormError(validatedData.errors);
        }
    };

    const handleFieldValidation = (form, formValues) => {
        updateForm(currentStep, formValues);
        return handleFormValidation(form, formValues, true);
    };

    const handleFormValidation = (form, formValues, ignoreEmpty = false) => {
        formValues = formValues ?? form.getFieldsValue();
        let fields = formValues ? Object.keys(formValues) : null;

        const { values, errors } = validateData(formValues, sorterFormSchema, fields, {
            abortEarly: false,
            allowUnknown: true
        });
        fields = fields ?? Object.keys(values);

        if (errors) {
            const errorKeys = Object.keys(errors);
            form.setFields(
                errorKeys.map((key) => ({
                    name: errors[key].path,
                    errors: ignoreEmpty && formValues[key] == null ? null : errors[key].message
                }))
            );
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

    return (
        <>
            {loadDraftInfo ? (
                <BoxWrapper style={{ padding: '10px', marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>There is a saved draft of this form. Do you want to load the previous draft?</span>
                    <Button
                        type='primary'
                        htmlType='button'
                        size='small'
                        style={{ marginLeft: '15px' }}
                        onClick={handleLoadDraft}
                    >
                        Load Draft
                    </Button>
                </BoxWrapper>
            ) : (
                <></>
            )}
            <Row style={{ width: '100%' }}>
                <Col span={6}>
                    <Affix>
                        <LayoutBlockWrapper>
                            <Steps current={currentStep} onChange={handleStepChange} direction='vertical'>
                                <Steps.Step
                                    title='Basic Info'
                                    status={stepStatus[0].cur}
                                    description='Sorter name, etc...'
                                />
                                <Steps.Step title='Groups' status={stepStatus[1].cur} description='Add selectable groups' />
                                <Steps.Step title='Items' status={stepStatus[2].cur} description='Add items and pictures' />
                                <Steps.Step title='Submit' status={stepStatus[3].cur} description='Review and submit' />
                            </Steps>
                        </LayoutBlockWrapper>
                    </Affix>
                </Col>
                {!loadingDraft ? (
                    <Col span={18}>
                        <LayoutBlockWrapper>
                            {/*--------------Step 1 - Basic Info--------------*/}
                            {currentStep === 0 && (
                                <CreateFormBase
                                    form={stepForms[0]}
                                    formName='step1'
                                    onValuesChange={handleFieldValidation}
                                />
                            )}
                            {/*--------------Step 2 - Groups--------------*/}
                            {currentStep === 1 && (
                                <CreateFormGroups
                                    form={stepForms[1]}
                                    formName='step2'
                                    colors={colorOptions}
                                    onValuesChange={handleFieldValidation}
                                />
                            )}
                            {/*--------------Step 3 - Items--------------*/}
                            {currentStep === 2 && (
                                <CreateFormItems
                                    form={stepForms[2]}
                                    formName='step3'
                                    groups={(() => {
                                        const groups = stepForms[1].getFieldValue('groups');
                                        return groups != null
                                            ? groups.filter((group) => group.name && group.name.length)
                                            : [];
                                    }).call()}
                                    editForm={charaEditForm}
                                    editFormState={editFormState}
                                    setEditFormState={setEditFormState}
                                    onValuesChange={handleFieldValidation}
                                />
                            )}
                            {/*--------------Step 4 - Submit--------------*/}
                            {currentStep === 3 && (
                                <Space size='middle' direction='vertical' style={{ width: '100%' }}>
                                    <SorterItemListing
                                        groups={
                                            mainFormState[1] && mainFormState[1].groups
                                                ? mainFormState[1].groups.filter(
                                                      (group) => group != null && group.color != null && group.name != null
                                                  )
                                                : []
                                        }
                                        items={mainFormState[2] && mainFormState[2].items ? mainFormState[2].items : []}
                                        pictureField={'displayPicture'}
                                    />

                                    {formError && (
                                        <div className='form-errors'>
                                            {Object.values(formError).map((error, index) => (
                                                <div className='ant-form-item-explain' key={index}>
                                                    {error.message}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <Button
                                        type='primary'
                                        onClick={handleSubmit}
                                        disabled={status === submissionStatus.INPROGRESS}
                                        loading={status === submissionStatus.INPROGRESS}
                                        block
                                    >
                                        Submit Sorter
                                    </Button>
                                </Space>
                            )}
                        </LayoutBlockWrapper>
                    </Col>
                ) : (
                    <></>
                )}
            </Row>
        </>
    );
};

const mapStateToProps = (state) => ({
    status: state.sorters.submissionStatus,
    idbStore: state.app.idbStore
});

const mapDispatchToProps = {
    submitNewSorter,
    updateSorterDraft,
    history: { push }
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterNew);
