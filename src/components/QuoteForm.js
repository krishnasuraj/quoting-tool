import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

const QuoteForm = ({ quoteData, updateQuoteData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: quoteData.companyName || '',
    licenseMethod: quoteData.licenseMethod || 'manual',
    teamSize: quoteData.teamSize || 0,
    enterpriseLicenses: quoteData.enterpriseLicenses || 0,
    cascadeLicenses: quoteData.cascadeLicenses || 0,
    aiFeaturePercentage: quoteData.aiFeaturePercentage || 50,
    complexDesignFrequency: quoteData.complexDesignFrequency || 50,
    newFeaturesPercentage: quoteData.newFeaturesPercentage || 50
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleToggleChange = (method) => {
    setFormData({
      ...formData,
      licenseMethod: method
    });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value)
    });
  };

  // Calculate recommended license mix based on questionnaire
  useEffect(() => {
    if (formData.licenseMethod === 'estimate' && formData.teamSize > 0) {
      calculateRecommendedLicenses();
    }
  }, [formData.teamSize, formData.aiFeaturePercentage, formData.complexDesignFrequency, formData.newFeaturesPercentage]);

  const calculateRecommendedLicenses = () => {
    if (formData.teamSize <= 0) return;

    // Calculate a weighted score for Cascade licenses
    const aiScore = formData.aiFeaturePercentage / 100;
    const complexityScore = formData.complexDesignFrequency / 100;
    const innovationScore = formData.newFeaturesPercentage / 100;
    
    // Average the scores and apply to team size
    const cascadeRatio = (aiScore + complexityScore + innovationScore) / 3;
    const cascadeLicenses = Math.round(formData.teamSize * cascadeRatio);
    const enterpriseLicenses = formData.teamSize - cascadeLicenses;
    
    setFormData(prev => ({
      ...prev,
      cascadeLicenses,
      enterpriseLicenses
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate quote details
    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + 30);
    
    const totalCost = (formData.enterpriseLicenses * 1000) + (formData.cascadeLicenses * 2000);
    
    const quoteDetails = {
      ...formData,
      quoteId: uuidv4().substring(0, 8),
      quoteDate: today.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      totalCost
    };
    
    updateQuoteData(quoteDetails);
    navigate('/quote');
  };

  return (
    <Container>
      <div className="form-container">
        <div className="main-form">
          <h2 className="form-title">Get your Codeium quote</h2>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="form-group">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="bg-dark text-white"
              />
            </Form.Group>
            
            <div className="toggle-container">
              <div 
                className={`toggle-option ${formData.licenseMethod === 'manual' ? 'active' : ''}`}
                onClick={() => handleToggleChange('manual')}
              >
                I know how many licenses I want
              </div>
              <div 
                className={`toggle-option ${formData.licenseMethod === 'estimate' ? 'active' : ''}`}
                onClick={() => handleToggleChange('estimate')}
              >
                Help me estimate
              </div>
            </div>
            
            {formData.licenseMethod === 'manual' ? (
              <div className="manual-license-section">
                <Form.Group className="license-input">
                  <Form.Label>Number of Cascade Licenses ($2,000/year)</Form.Label>
                  <Form.Control
                    type="number"
                    name="cascadeLicenses"
                    value={formData.cascadeLicenses}
                    onChange={handleInputChange}
                    min="0"
                    className="cascade-input bg-dark text-white"
                  />
                </Form.Group>
                
                <Form.Group className="license-input">
                  <Form.Label>Number of Enterprise Licenses ($1,000/year)</Form.Label>
                  <Form.Control
                    type="number"
                    name="enterpriseLicenses"
                    value={formData.enterpriseLicenses}
                    onChange={handleInputChange}
                    min="0"
                    className="bg-dark text-white"
                  />
                </Form.Group>
              </div>
            ) : (
              <div className="estimate-section">
                <Form.Group className="form-group">
                  <Form.Label>How many total software developers does your team have?</Form.Label>
                  <Form.Control
                    type="number"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="bg-dark text-white"
                  />
                </Form.Group>
                
                <div className="slider-container">
                  <div className="slider-label">
                    <span>What percentage of your team needs advanced AI features versus basic code completion?</span>
                    <span className="percentage-value">{formData.aiFeaturePercentage}%</span>
                  </div>
                  <Form.Range
                    name="aiFeaturePercentage"
                    value={formData.aiFeaturePercentage}
                    onChange={handleSliderChange}
                    min="0"
                    max="100"
                    style={{ accentColor: '#0AB7A2' }}
                  />
                  <div className="d-flex justify-content-between">
                    <small>Basic features</small>
                    <small>Advanced AI</small>
                  </div>
                </div>
                
                <div className="slider-container">
                  <div className="slider-label">
                    <span>How often does your team work on complex design problems instead of routine coding?</span>
                    <span className="percentage-value">{formData.complexDesignFrequency}%</span>
                  </div>
                  <Form.Range
                    name="complexDesignFrequency"
                    value={formData.complexDesignFrequency}
                    onChange={handleSliderChange}
                    min="0"
                    max="100"
                    style={{ accentColor: '#0AB7A2' }}
                  />
                  <div className="d-flex justify-content-between">
                    <small>Routine coding</small>
                    <small>Complex design</small>
                  </div>
                </div>
                
                <div className="slider-container">
                  <div className="slider-label">
                    <span>What percentage of your team builds new features versus maintains existing codebases?</span>
                    <span className="percentage-value">{formData.newFeaturesPercentage}%</span>
                  </div>
                  <Form.Range
                    name="newFeaturesPercentage"
                    value={formData.newFeaturesPercentage}
                    onChange={handleSliderChange}
                    min="0"
                    max="100"
                    style={{ accentColor: '#0AB7A2' }}
                  />
                  <div className="d-flex justify-content-between">
                    <small>Maintenance</small>
                    <small>New features</small>
                  </div>
                </div>
                
                <div className="recommended-mix mt-4">
                  <h5>Recommended License Mix</h5>
                  <p>Based on your answers, we recommend:</p>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="license-input">
                        <Form.Label>Cascade Licenses ($2,000/year)</Form.Label>
                        <Form.Control
                          type="number"
                          name="cascadeLicenses"
                          value={formData.cascadeLicenses}
                          onChange={handleInputChange}
                          min="0"
                          className="cascade-input bg-dark text-white"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="license-input">
                        <Form.Label>Enterprise Licenses ($1,000/year)</Form.Label>
                        <Form.Control
                          type="number"
                          name="enterpriseLicenses"
                          value={formData.enterpriseLicenses}
                          onChange={handleInputChange}
                          min="0"
                          className="bg-dark text-white"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>
            )}
            
            <div className="text-center">
              <Button type="submit" className="btn-generate" style={{ backgroundColor: '#0AB7A2' }}>
                Generate Quote
              </Button>
            </div>
          </Form>
        </div>
        
        <div className="sidebar">
          <div className="plan-box cascade-box">
            <h4>Cascade details</h4>
            <p><strong>$2,000</strong> per user/year</p>
            <ul>
              <li>All Enterprise features</li>
              <li>AI agent for complex tasks</li>
              <li>Multi-repository context</li>
              <li>Advanced code generation</li>
              <li>Priority support</li>
            </ul>
          </div>
          
          <div className="plan-box enterprise-box">
            <h4>Enterprise details</h4>
            <p><strong>$1,000</strong> per user/year</p>
            <ul>
              <li>AI-powered code completion</li>
              <li>Code search across repositories</li>
              <li>Code explanation</li>
              <li>Enterprise-grade security</li>
              <li>Standard support</li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default QuoteForm;
