"use client";
import React from "react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// สร้างตัวแปร Page ที่เป็นฟังก์ชันคอมโพเนนต์

export default function Page() {
  const router = useRouter();
  const id = useParams().id;

  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [is_completed, setIsCompleted] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [oldImageUrl, setOldImageUrl] = useState<string>("");

  useEffect(() => {
    async function fetchTask() {}
    fetchTask();
  }, []);

  async function handleUploadAndUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // อัปโหลดรูปภาพใหม่ถ้ามีการเลือก

    //  อัปโหลดรูปภาพใหม่ถ้ามีการเลือก

    // อัปโหลดรูปภาพใหม่
  }

  // อัปเดตข้อมูลงาน

  // นำทางกลับไปยังหน้ารายการงานทั้งหมด

  return (
    <div className="flex flex-col w-3/4 mx-auto pb-20">
      <div className="flex flex-col items-center mt-20 gap-4">
        <Image src={logo} alt="Logo" width={150} height={150} />
        <h1 className="text-2xl font-bold mt-10">Task Manager App</h1>
        <h1 className="text-gray-600">บันทึก จัดการงาน</h1>
      </div>

      <div className="mt-10 flex flex-col border border-gray-300 p-5">
        <h1 className="text-center text-xl font-bold">แก้ไขงาน</h1>
        <form onSubmit={handleUploadAndUpdate}>
          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold"> งานที่ทำ</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-2"
              required // --- เพิ่ม required เพื่อบังคับให้กรอก ---
            />
          </div>
          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold">รายละเอียด</label>
            <textarea className="border border-gray-300 rounded-lg p-2"></textarea>
          </div>

          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold">อัปโหลดรูปภาพ</label>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
            />
            <label
              htmlFor="fileInput"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer w-32 text-center">
              เลือกรูป
            </label>
            {previewUrl && (
              <div className="mt-4">
                <Image
                  src={previewUrl}
                  alt="preview"
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold ">สถานะงาน</label>
            <select className="border border-gray-300 rounded-lg p-2">
              <option value="not_completed">ยังไม่เสร็จสิ้น</option>
              <option value="completed">เสร็จสิ้น</option>
            </select>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 w-full">
              บันทึกแก้ไขงานเก่า
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center mt-10 ">
        <Link href="/" className="text-blue-600 font-bold text-center">
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
