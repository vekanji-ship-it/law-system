import './globals.css'

export const metadata = {
  title: '地政X經紀同根生 | Kmoji',
  description: '地政士與不動產經紀人的專業知識平台，包含法條解析、考古題庫、實務案例',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
