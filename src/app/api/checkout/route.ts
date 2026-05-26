import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;

    // Если ключей ЮKassa нет (как у нас сейчас), мы возвращаем ссылку на наш симулятор оплаты.
    // Когда вы получите реальные ключи, мы вставим сюда настоящий запрос к API ЮKassa (https://api.yookassa.ru/v3/payments).
    if (!shopId || !secretKey) {
      console.log("ЮKassa ключи не найдены. Используем симулятор оплаты.");
      return NextResponse.json({ url: '/payment-simulator' });
    }

    // Заглушка для будущего реального кода ЮKassa
    return NextResponse.json({ url: '/payment-simulator' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
