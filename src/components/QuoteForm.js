import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Accordion, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const QuoteForm = ({ quoteData, updateQuoteData }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: quoteData.companyName || '',
    teamSize: quoteData.teamSize || '',
    licenseSelectionMethod: 'manual',
    enterpriseLicenses: quoteData.enterpriseLicenses || 0,
    cascadeLicenses: quoteData.cascadeLicenses || 0,
    // Questionnaire data
    proprietaryCodePercentage: 50,
    codeCompletionImportance: 3,
    multiRepoWork: 'no',
    programmingLanguagesCount: '1-3',
    needsEnterpriseSecurity: 'no'
  });

  const [validated, setValidated] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value)
    });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : parseInt(value);
    setFormData({
      ...formData,
      [name]: numValue
    });
  };

  const calculateRecommendedLicenses = () => {
    const { teamSize, proprietaryCodePercentage, codeCompletionImportance, multiRepoWork, programmingLanguagesCount, needsEnterpriseSecurity } = formData;
    
    if (!teamSize) return { enterprise: 0, cascade: 0 };
    
    // Convert team size to number
    const totalTeamSize = parseInt(teamSize);
    
    // Base calculation - start with all Enterprise licenses
    let cascadePercentage = 0;
    
    // Factors that increase Cascade percentage
    // 1. High proprietary code percentage increases Cascade need
    cascadePercentage += (proprietaryCodePercentage / 100) * 20;
    
    // 2. High importance of code completion increases Cascade need
    cascadePercentage += (codeCompletionImportance / 5) * 15;
    
    // 3. Multi-repo work strongly suggests Cascade
    if (multiRepoWork === 'yes') {
      cascadePercentage += 25;
    }
    
    // 4. More programming languages suggests Cascade
    if (programmingLanguagesCount === '4-6') {
      cascadePercentage += 15;
    } else if (programmingLanguagesCount === '7+') {
      cascadePercentage += 25;
    }
    
    // 5. Enterprise security needs suggest more Enterprise licenses
    if (needsEnterpriseSecurity === 'yes') {
      cascadePercentage -= 10; // Reduce Cascade percentage
    }
    
    // Ensure percentage is within bounds
    cascadePercentage = Math.max(0, Math.min(100, cascadePercentage));
    
    // Calculate license counts
    const cascadeLicenses = Math.round((cascadePercentage / 100) * totalTeamSize);
    const enterpriseLicenses = totalTeamSize - cascadeLicenses;
    
    return {
      enterprise: enterpriseLicenses,
      cascade: cascadeLicenses
    };
  };

  const nextStep = (e) => {
    if (e) e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setStep(step + 1);
    
    // If moving to step 3 and using questionnaire, calculate recommended licenses
    if (step === 2 && formData.licenseSelectionMethod === 'questionnaire') {
      const recommended = calculateRecommendedLicenses();
      setFormData({
        ...formData,
        enterpriseLicenses: recommended.enterprise,
        cascadeLicenses: recommended.cascade
      });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const calculateTotal = () => {
    const enterpriseTotal = formData.enterpriseLicenses * 1000;
    const cascadeTotal = formData.cascadeLicenses * 2000;
    return enterpriseTotal + cascadeTotal;
  };

  const generateQuote = () => {
    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + 30);
    
    const quoteId = uuidv4().substring(0, 8).toUpperCase();
    
    const quoteDetails = {
      companyName: formData.companyName,
      teamSize: formData.teamSize,
      enterpriseLicenses: formData.enterpriseLicenses,
      cascadeLicenses: formData.cascadeLicenses,
      quoteId: quoteId,
      quoteDate: today.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      totalCost: calculateTotal()
    };
    
    updateQuoteData(quoteDetails);
    navigate('/quote-review');
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <h2 className="text-center mb-4">Create Your Codeium Quote</h2>
          <ProgressBar 
            now={step * 33.33} 
            className="mb-4" 
            variant="primary" 
            label={`Step ${step} of 3`} 
          />
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              {step === 1 && (
                <Form noValidate validated={validated} onSubmit={nextStep}>
                  <h4 className="mb-3">Company Information</h4>
                  <Form.Group className="mb-3" controlId="companyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide your company name.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="teamSize">
                    <Form.Label>Software Development Team Size</Form.Label>
                    <Form.Control
                      type="number"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleNumberChange}
                      min="1"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide your team size (minimum 1).
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex justify-content-end mt-4">
                    <Button type="submit" variant="primary">
                      Next
                    </Button>
                  </div>
                </Form>
              )}

              {step === 2 && (
                <Form onSubmit={nextStep}>
                  <h4 className="mb-3">License Selection Method</h4>
                  <Form.Group className="mb-4">
                    <Form.Check
                      type="radio"
                      id="manual-selection"
                      name="licenseSelectionMethod"
                      value="manual"
                      label="I know how many licenses I need"
                      checked={formData.licenseSelectionMethod === 'manual'}
                      onChange={handleRadioChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="radio"
                      id="questionnaire"
                      name="licenseSelectionMethod"
                      value="questionnaire"
                      label="I'm not sure what licenses I need (use questionnaire)"
                      checked={formData.licenseSelectionMethod === 'questionnaire'}
                      onChange={handleRadioChange}
                    />
                  </Form.Group>

                  {formData.licenseSelectionMethod === 'manual' ? (
                    <div>
                      <h5 className="mb-3">License Information</h5>
                      <Accordion defaultActiveKey="0" className="mb-4">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Enterprise License - $1,000/year per seat</Accordion.Header>
                          <Accordion.Body>
                            <p>Our Enterprise license provides advanced code completion, code search, and code explanation features for professional developers working on proprietary codebases.</p>
                            <ul>
                              <li>AI-powered code completion</li>
                              <li>Code search across repositories</li>
                              <li>Code explanation and documentation</li>
                              <li>Enterprise-grade security</li>
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                          <Accordion.Header>Cascade License - $2,000/year per seat</Accordion.Header>
                          <Accordion.Body>
                            <p>Our Cascade license includes all Enterprise features plus advanced AI agent capabilities for complex coding tasks and cross-repository work.</p>
                            <ul>
                              <li>All Enterprise features</li>
                              <li>AI agent for complex tasks</li>
                              <li>Multi-repository context understanding</li>
                              <li>Advanced code generation</li>
                              <li>Priority support</li>
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>

                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group controlId="enterpriseLicenses">
                            <Form.Label>Number of Enterprise Licenses</Form.Label>
                            <Form.Control
                              type="number"
                              name="enterpriseLicenses"
                              value={formData.enterpriseLicenses}
                              onChange={handleNumberChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="cascadeLicenses">
                            <Form.Label>Number of Cascade Licenses</Form.Label>
                            <Form.Control
                              type="number"
                              name="cascadeLicenses"
                              value={formData.cascadeLicenses}
                              onChange={handleNumberChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {parseInt(formData.teamSize) !== (parseInt(formData.enterpriseLicenses) + parseInt(formData.cascadeLicenses)) && (
                        <div className="alert alert-warning">
                          <strong>Note:</strong> The total number of licenses ({parseInt(formData.enterpriseLicenses) + parseInt(formData.cascadeLicenses)}) 
                          does not match your team size ({formData.teamSize}).
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="questionnaire-section">
                      <h5 className="mb-3">License Recommendation Questionnaire</h5>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          What percentage of your developers work primarily on proprietary code?
                          <span className="ms-2 text-muted">({formData.proprietaryCodePercentage}%)</span>
                        </Form.Label>
                        <Form.Range
                          name="proprietaryCodePercentage"
                          value={formData.proprietaryCodePercentage}
                          onChange={handleSliderChange}
                          min="0"
                          max="100"
                        />
                        <div className="d-flex justify-content-between">
                          <small>0%</small>
                          <small>50%</small>
                          <small>100%</small>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          How important is advanced code completion to your team?
                          <span className="ms-2 text-muted">({formData.codeCompletionImportance}/5)</span>
                        </Form.Label>
                        <Form.Range
                          name="codeCompletionImportance"
                          value={formData.codeCompletionImportance}
                          onChange={handleSliderChange}
                          min="1"
                          max="5"
                        />
                        <div className="d-flex justify-content-between">
                          <small>Not important</small>
                          <small>Very important</small>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Do your developers frequently work across multiple repositories?</Form.Label>
                        <div>
                          <Form.Check
                            inline
                            type="radio"
                            id="multi-repo-yes"
                            name="multiRepoWork"
                            value="yes"
                            label="Yes"
                            checked={formData.multiRepoWork === 'yes'}
                            onChange={handleRadioChange}
                          />
                          <Form.Check
                            inline
                            type="radio"
                            id="multi-repo-no"
                            name="multiRepoWork"
                            value="no"
                            label="No"
                            checked={formData.multiRepoWork === 'no'}
                            onChange={handleRadioChange}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>How many programming languages does your team regularly use?</Form.Label>
                        <Form.Select
                          name="programmingLanguagesCount"
                          value={formData.programmingLanguagesCount}
                          onChange={handleInputChange}
                        >
                          <option value="1-3">1-3 languages</option>
                          <option value="4-6">4-6 languages</option>
                          <option value="7+">7+ languages</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Do you need enterprise-grade security features?</Form.Label>
                        <div>
                          <Form.Check
                            inline
                            type="radio"
                            id="security-yes"
                            name="needsEnterpriseSecurity"
                            value="yes"
                            label="Yes"
                            checked={formData.needsEnterpriseSecurity === 'yes'}
                            onChange={handleRadioChange}
                          />
                          <Form.Check
                            inline
                            type="radio"
                            id="security-no"
                            name="needsEnterpriseSecurity"
                            value="no"
                            label="No"
                            checked={formData.needsEnterpriseSecurity === 'no'}
                            onChange={handleRadioChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    <Button variant="secondary" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="submit" variant="primary">
                      Next
                    </Button>
                  </div>
                </Form>
              )}

              {step === 3 && (
                <div>
                  <h4 className="mb-3">Review Your Quote</h4>
                  <div className="mb-4">
                    <h5>Company Information</h5>
                    <p><strong>Company Name:</strong> {formData.companyName}</p>
                    <p><strong>Team Size:</strong> {formData.teamSize} developers</p>
                  </div>

                  <div className="mb-4">
                    <h5>License Selection</h5>
                    <p><strong>Enterprise Licenses:</strong> {formData.enterpriseLicenses} × $1,000 = ${formData.enterpriseLicenses * 1000}</p>
                    <p><strong>Cascade Licenses:</strong> {formData.cascadeLicenses} × $2,000 = ${formData.cascadeLicenses * 2000}</p>
                    <p><strong>Implementation Fee:</strong> $0.00</p>
                    <h5 className="mt-3">Total Annual Cost: ${calculateTotal()}</h5>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <Button variant="secondary" onClick={prevStep}>
                      Back
                    </Button>
                    <Button variant="success" onClick={generateQuote}>
                      Generate Quote
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QuoteForm;
