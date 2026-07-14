import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.post('/api/login', async ({ request }) => {
    // Basahin ang payload na pinadala ng frontend (LoginPage.jsx)
    const body = await request.json();

    // ─── FAKE DATABASE CHECK ───
    // Kunwari, ito lang ang tamang email at password sa system ninyo
    if (body.email === 'tinadepadua19@gmail.com' && body.password === 'admin123') {
      return HttpResponse.json({
        message: "Login successful",
        token: "fake-jwt-token-123",
        admin: { id: "1", name: "Test Admin", email: "tinadepadua19@gmail.com" }
      }, { status: 200 }); // SUCCESS
    }

    // ─── KAPAG MALI ANG CREDENTIALS ───
    return HttpResponse.json({
      message: "Invalid email or password."
    }, { status: 401 }); // UNAUTHORIZED
  }),
];