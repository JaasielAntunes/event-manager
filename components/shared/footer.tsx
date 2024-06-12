import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-200 pt-5 pb-5">
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center">
        <div className="flex justify-center mx-3 my-2">
          <Link href="/">
            <Image
              src="/assets/images/logo.svg"
              alt="logo"
              width={120}
              height={30}
            />
          </Link>
        </div>

        <p className="text-black text-center text-sm mx-3 my-2">
          © 2024 Evently - Todos os direitos reservados.
        </p>

        <p className="text-black text-center text-sm mx-3 my-2">
          Desenvolvido por{' '}
          <span className="text-orange-500 font-semibold">Nexus Code</span>
        </p>
      </div>
    </footer>
  )
}
