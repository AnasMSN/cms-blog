import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="wrap page">
      <h1 className="h1">Halaman tidak ditemukan</h1>
      <p className="lede">Mungkin produknya sudah tidak dijual atau alamatnya berubah.</p>
      <Link className="btn" href="/produk">
        Lihat semua produk
      </Link>
    </div>
  )
}
