import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#7c3aed',
          borderRadius: 7,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 60 60"
          fill="none"
        >
          <path
            d="M30 5 L50 17.5 L50 42.5 L30 55 L10 42.5 L10 17.5 Z"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M30 20 L40 35 L20 35 Z"
            fill="white"
          />
          <circle cx="30" cy="30" r="4" fill="#7c3aed" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
