import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmergencyEmailRequest {
  studentName: string;
  roomNumber: string;
  floor: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentName, roomNumber, floor, message }: EmergencyEmailRequest = await req.json();
    
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
    });

    const emailBody = `Emergency Alert from Student

Student Name: ${studentName}
Room Number: ${roomNumber}
Floor: ${floor}
Message:
${message}

Time: ${timestamp}

Please take immediate action.`;

    console.log("Sending emergency email to supervisor...");
    console.log("Email body:", emailBody);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "HallHub Emergency <onboarding@resend.dev>",
        to: ["marjiakhan08@gmail.com"],
        subject: "Hall Emergency Alert – Immediate Attention Required",
        text: emailBody,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailSent: true,
        messageId: emailResponse.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending emergency email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        emailSent: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
