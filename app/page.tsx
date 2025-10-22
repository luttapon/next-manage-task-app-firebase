import React from "react";
import Image from "next/image";
import logo from "../assets/logo.png";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center mt-20 gap-4">
        <Image src={logo} alt="Logo" width={150} height={150} />
        <h1 className="text-2xl font-bold mt-10">Task Manager App</h1>
        <h1 className="text-gray-600">บันทึก จัดการงาน</h1>
        <Link
          href="/alltask"
          className="mt-10 px-40 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          เข้าใช้งาน
        </Link>
      </div>
    </>
  );
}
