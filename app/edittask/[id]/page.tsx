"use client";
import React from "react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { supabase } from "@/lib/supabaseClient";
import { firebase } from "@/lib/firebaseConfig";

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
    async function fetchTask() {
      try{
        const docRef = doc(firebase, "task_tb", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setDetail(data.detail);
          setIsCompleted(data.is_completed);
          setOldImageUrl(data.image_url);
          setPreviewUrl(data.image_url);
        }
      }catch (error) {
       alert("พบข้อผิดพลาดในการดึงข้อมูลงาน:");
       console.log((error as Error).message);
       return;
      }
    }
    fetchTask();
  }, [id]);

  async function handleUploadAndUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
   let image_url = previewUrl || ""; // ใช้ URL เดิมถ้าไม่มีการเลือกใหม่

    //  อัปโหลดรูปภาพใหม่ถ้ามีการเลือก
    if (imageFile) {
      // ลบรูปภาพเก่าถ้ามี
      if (oldImageUrl != "") {
        const image_name = oldImageUrl.split("/").pop() as string;
        const { data, error } = await supabase.storage
          .from("task_bk")
          .remove([image_name]);

        if (error) {
          alert("พบข้อผิดพลาดในการลบรูปภาพ:");
          console.log(error.message);
          return;
        }
      }
      // อัปโหลดรูปภาพใหม่
      const new_image_file_name = `${Date.now()}-${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from("task_bk")
        .upload(new_image_file_name, imageFile);

      if (error) {
        alert("มีข้อผิดพลาดในการอัพโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
        console.log(error.message);
        return;
      } else {
        const { data } = await supabase.storage
          .from("task_bk")
          .getPublicUrl(new_image_file_name);

        image_url = data.publicUrl;
      }
    }
    try {
      await updateDoc(doc(firebase, "task_tb", id as string), {
        title: title,
        detail: detail,
        is_completed: is_completed,
        image_url: image_url,
        update_at: new Date().toISOString(),

      });
      router.push("/");
    }catch (error) {
      alert("พบข้อผิดพลาดในการอัปเดตข้อมูลงาน:");
      console.log((error as Error).message);
      return;
  }
}
    // อัปเดตข้อมูลงานใน Firestore

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
