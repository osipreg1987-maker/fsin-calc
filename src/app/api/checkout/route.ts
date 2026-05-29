import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { planType, archiveId } = await req.json().catch(() => ({}));
    
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;

    // Если ключей ЮKassa нет (как у нас сейчас), мы возвращаем ссылку на наш симулятор оплаты.
    // Когда вы получите реальные ключи, мы вставим сюда настоящий запрос к API ЮKassa (https://api.yookassa.ru/v3/payments).
    if (!shopId || !secretKey) {
      console.log("ЮKassa ключи не найдены. Используем симулятор оплаты для:", { planType, archiveId });
      
      const queryParams = new URLSearchParams();
      if (planType) queryParams.set('planType', planType);
      if (archiveId) queryParams.set('archiveId', archiveId);
      
      const queryString = queryParams.toString();
      const redirectUrl = `/payment-simulator${queryString ? `?${queryString}` : ''}`;
      
      return NextResponse.json({ url: redirectUrl });
    }

    // Заглушка для будущего реального кода ЮKassa
    const queryParams = new URLSearchParams();
    if (planType) queryParams.set('planType', planType);
    if (archiveId) queryParams.set('archiveId', archiveId);
    const queryString = queryParams.toString();
    
    return NextResponse.json({ url: `/payment-simulator${queryString ? `?${queryString}` : ''}` });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

