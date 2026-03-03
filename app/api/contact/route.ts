import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    goal: String(formData.get("goal") || ""),
    createdAt: new Date().toISOString(),
  };

  if (!payload.name || !payload.email || !payload.goal) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
  }

  return NextResponse.json(
    {
      ok: true,
      message: "Demande reçue. Vous pouvez connecter ce endpoint à un CRM ou un service email.",
      payload,
    },
    { status: 200 }
  );
}
