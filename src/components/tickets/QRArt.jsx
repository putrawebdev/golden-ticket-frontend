export default function QRArt({ value = 'GZ26-GOLDEN-TICKET', size = 160 }) {
  return (
    <div className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-sm" style={{ maxWidth: size }}>
      <img 
        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=2&data=${encodeURIComponent(value)}`} 
        alt={`QR Code ${value}`}
        className="aspect-square w-full object-contain"
      />
    </div>
  )
}