import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `你是「地政同根生 AI 顧問」，專門回答台灣地政士與不動產經紀人的專業問題。

你的專業範圍：
- 土地法、地政士法、不動產經紀業管理條例
- 民法物權編（不動產相關）
- 土地稅法（土地增值稅、地價稅、房地合一稅）
- 不動產登記實務（繼承、買賣、抵押、預告登記等）
- 地政士與房仲的業務分工與合作
- 不動產交易常見糾紛與處理方式
- 農地、公設保留地、信託財產等特殊土地議題

回答原則：
1. 用繁體中文回答，語氣專業但易懂
2. 重要法條必須引用條文出處（如：土地法第34條之1）
3. 同時提供地政士視角與房仲視角的建議
4. 若問題涉及具體個案，提醒用戶仍需諮詢專業地政士或律師
5. 每個回答結構：先直接回答問題 → 引用法條 → 實務建議 → 注意事項
6. 不回答與不動產/地政無關的問題，請禮貌引導回專業範疇

你服務的是已付費的專業會員，請給予高品質、有深度的專業解答。`

export async function POST(request) {
  try {
    const { messages, isPaid } = await request.json()

    if (!messages || messages.length === 0) {
      return Response.json({ error: '沒有問題內容' }, { status: 400 })
    }

    // 免費用戶限制（每次對話最多3輪）
    if (!isPaid && messages.filter(m => m.role === 'user').length > 3) {
      return Response.json({
        error: 'FREE_LIMIT',
        message: '免費版每次對話限3個問題，升級付費版享無限制 AI 問答！'
      }, { status: 403 })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    })

    return Response.json({
      content: response.content[0].text,
      usage: response.usage
    })

  } catch (error) {
    console.error('AI chat error:', error)
    return Response.json({ error: '服務暫時不可用，請稍後再試' }, { status: 500 })
  }
}
