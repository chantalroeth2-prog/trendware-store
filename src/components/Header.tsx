"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, List, MagnifyingGlass, ShoppingBag, Sparkle, User, X } from "@phosphor-icons/react";
import { useCart } from "./CartProvider";

export default function Header() {
  const { itemCount, openDrawer } = useCart();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (query.trim()) router.push(`/shop?search=${encodeURIComponent(query.trim())}`); };
  const links = [["Shop", "/shop"], ["Kategorien", "/shop"], ["Über uns", "/#warum"], ["FAQ", "/kontakt"]];
  return (
    <header className="tw-header">
      <div className="tw-shell tw-header-inner">
        <button className="md:hidden tw-icon-button" onClick={() => setMenu(!menu)} aria-label="Menü">{menu ? <X size={22} /> : <List size={22} />}</button>
        <Link href="/" className="tw-logo"><Sparkle size={17} weight="fill" />TRENDWARE</Link>
        <nav className="tw-nav">{links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</nav>
        <form onSubmit={submit} className="tw-search"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Suche nach Produkten..." /><button aria-label="Suchen"><MagnifyingGlass size={17} /></button></form>
        <div className="tw-header-actions"><Link href="/kontakt" aria-label="Konto"><User size={21} /></Link><Link href="/shop" aria-label="Merkliste" className="hidden sm:block"><Heart size={21} /></Link><button onClick={openDrawer} aria-label="Warenkorb" className="tw-cart-button"><ShoppingBag size={22} />{itemCount > 0 && <span>{itemCount}</span>}</button></div>
      </div>
      {menu && <nav className="tw-mobile-nav">{links.map(([label, href]) => <Link onClick={() => setMenu(false)} href={href} key={label}>{label}</Link>)}<form onSubmit={submit} className="tw-search"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Produkte suchen..." /><button><MagnifyingGlass size={17} /></button></form></nav>}
    </header>
  );
}
