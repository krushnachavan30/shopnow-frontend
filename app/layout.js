import { AuthProvider } from '../context/AuthContext'
import './globals.css'

export const metadata = {
  title: 'ECommerce Store',
  description: 'Buy anything online',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}