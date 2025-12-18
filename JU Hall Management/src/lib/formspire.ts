/**
 * FormSphere Integration for JU Hall Management
 * Handles Contact and Emergency form submissions
 */

const FORMSPHERE_ENDPOINT = 'https://formsphere.vercel.app/api/submit';
const TARGET_EMAIL = 'marjiakhan08@gmail.com';

interface FormSphereResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Submit contact form via FormSphere
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<FormSphereResponse> {
  try {
    const response = await fetch(FORMSPHERE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: TARGET_EMAIL,
        subject: `[JU Hall Contact] ${data.subject}`,
        formType: 'contact',
        fields: {
          'Name': data.name,
          'Email': data.email,
          'Phone': data.phone || 'Not provided',
          'Subject': data.subject,
          'Message': data.message,
          'Submitted At': new Date().toLocaleString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: result.message || 'Form submitted successfully',
    };
  } catch (error) {
    console.error('FormSphere submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit form',
    };
  }
}

/**
 * Submit emergency form via FormSphere
 */
export async function submitEmergencyForm(data: {
  studentName?: string;
  emergencyType: string;
  location: string;
  contactNumber: string;
  description?: string;
}): Promise<FormSphereResponse> {
  try {
    const emergencyLabels: Record<string, string> = {
      medical: '🏥 Medical Emergency',
      accident: '⚠️ Accident',
      fire: '🔥 Fire',
      security: '🛡️ Security Issue',
      other: '📋 Other',
    };

    const response = await fetch(FORMSPHERE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: TARGET_EMAIL,
        subject: `🚨 [EMERGENCY] ${emergencyLabels[data.emergencyType] || data.emergencyType}`,
        formType: 'emergency',
        priority: 'high',
        fields: {
          'Student Name': data.studentName || 'Unknown',
          'Emergency Type': emergencyLabels[data.emergencyType] || data.emergencyType,
          'Location': data.location,
          'Contact Number': data.contactNumber,
          'Description': data.description || 'No description provided',
          'Submitted At': new Date().toLocaleString(),
          'Status': 'URGENT - Requires Immediate Attention',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: result.message || 'Emergency request submitted successfully',
    };
  } catch (error) {
    console.error('FormSphere emergency submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit emergency request',
    };
  }
}

/**
 * Generic FormSphere submission
 */
export async function submitFormSphere(
  subject: string,
  formType: string,
  fields: Record<string, string>
): Promise<FormSphereResponse> {
  try {
    const response = await fetch(FORMSPHERE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: TARGET_EMAIL,
        subject: `[JU Hall] ${subject}`,
        formType,
        fields: {
          ...fields,
          'Submitted At': new Date().toLocaleString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: result.message || 'Form submitted successfully',
    };
  } catch (error) {
    console.error('FormSphere submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit form',
    };
  }
}
