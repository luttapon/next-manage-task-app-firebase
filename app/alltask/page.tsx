"use client";
import Image from "next/image";
import logo from "./../../assets/logo.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { firebase } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import { supabase } from "@/lib/supabaseClient";

 
//สร้างประเภทตัวแปรเพื่อเก็บข้อมูลที่ดึงมาจาก Firebase
type Task = {
  id: string;
  title: string;
  detail: string;
  is_completed: boolean;
  image_url: string;
  created_at: string;
  update_at: string;
};
 
export default function Page() {
  //สร้างตัวแปร state เพื่อเก็บข้อมูลที่ดึงมาจาก Firebase
  const [tasks, setTasks] = useState<Task[]>([]);
 
  //เมื่อเพจถูกโหลด ให้ดึงข้อมูลจาก Firebase เพื่อมาแสดงผลที่หน้าเพจ
  useEffect(() => {
    async function fetchTasks() {
      //ไปดึงข้อมูลจาก Firebase (มีหลายข้อมูล)
      const result = await getDocs(collection(firebase, "task"));
 
      //เอาข้อมูลที่อยู่ใน result ไปกำหนดให้กับตัวแปร state: tasks
      setTasks(
        result.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          detail: doc.data().detail,
          is_completed: doc.data().is_completed,
          image_url: doc.data().image_url,
          created_at: doc.data().created_at,
          update_at: doc.data().update_at,
        }))
      );
    }
 
    fetchTasks();
  }, []);
 
  //สร้างฟังก์ชัน ลบข้อมูลออกจากคอเล็คชัน Firebase
  async function handleDeleteTaskClick(id: number, image_url: string) {
if (confirm("คุณต้องการลบงานนี้ใช่หรือไม่?")) {
  // ลบรูปภาพจาก Supabase Storage ถ้ามี
  if (image_url != "" ) {
    const image_name = image_url.split("/").pop() as string;
    const { data, error } = await supabase.storage
      .from("task_bk")
      .remove([image_name]);

    if (error) {
      alert("พบข้อผิดพลาดในการลบรูปภาพ:");
      console.log(error.message);
      return;
      }
  }try {
    // ลบงานจากฐานข้อมูล
    await deleteDoc(doc(firebase, "task_tb", id.toString()));


  // ลบงานจากฐานข้อมูล

  // ตรวจสอบข้อผิดพลาดและแจ้งเตือนผู้ใช้
  } catch (error) {
    alert("พบข้อผิดพลาดในการลบงาน:");
    console.log((error as Error).message);
    return;
  }
  }


  // ลบข้อมูลออกจากรายการที่แสดงผล
    setTasks(tasks.filter((task) => task.id !== id.toString()));
  }
 
  // แสดงผลหน้าเพจ
  return (
    <div className="flex flex-col w-8/12 mx-auto">
      {/* ส่วนหัว */}
      <div className="flex flex-col items-center mt-20">
        <Image src={logo} alt="logo" width={100} height={100} />
        <h1 className="text-xl font-bold mt-5">Manage Task App (Firebase)</h1>
        <h1 className="text-xl font-bold">บันทึกงานที่ต้องทำ</h1>
      </div>
 
      {/* ส่วนปุ่มเพิ่ม */}
      <div className="flex justify-end">
        <Link
          href="/addtask"
          className="mt-10 bg-blue-500 hover:bg-blue-700
                                     text-white font-bold py-3 px-4 w-max rounded
                                       "
        >
          เพิ่มงาน
        </Link>
      </div>
 
      {/* ส่วนแสดงตารางข้อมูลที่ดึงมา */}
      <div className="mt-5">
        <table className="min-w-full border border-black text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-black p-2">รูป</th>
              <th className="border border-black p-2">งานที่ต้องทำ</th>
              <th className="border border-black p-2">รายละเอียด</th>
              <th className="border border-black p-2">สถานะ</th>
              <th className="border border-black p-2">วันที่เพิ่ม</th>
              <th className="border border-black p-2">วันที่แก้ไข</th>
              <th className="border border-black p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* วนลูปตามจำนวนข้อมูลที่อยู่ในตัวแปร state: tasks */}
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border border-black p-2 text-center">
                  {task.image_url ? (
                    <Image
                      src={task.image_url}
                      alt="logo"
                      width={50}
                      height={50}
                      className="mx-auto"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border border-black p-2">{task.title}</td>
                <td className="border border-black p-2">{task.detail}</td>
                {task.is_completed ? (
                  <td className="border border-black text-green-500 p-2 text-center">
                    เสร็จสิ้น
                  </td>
                ) : (
                  <td className="border border-black text-red-500 p-2 text-center">
                    ยังไม่เสร็จสิ้น
                  </td>
                )}
 
                <td className="border border-black p-2">
                  {new Date(task.created_at).toLocaleString()}
                </td>
                <td className="border border-black p-2">
                  {new Date(task.update_at).toLocaleString()}
                </td>
                <td className="border border-black p-2 text-center">
                  <Link href={`/edittask/${task.id}`} className="mr-2 text-green-500 font-bold" >
                    แก้ไข
                  </Link>
                  <button
                    onClick={() =>
                      handleDeleteTaskClick(parseInt(task.id), task.image_url)
                    }
                    className="text-red-500 font-bold cursor-pointer"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <div className="flex justify-center mt-10">
        <Link href="/" className="text-blue-600 font-bold">
          กลับไปหน้าแรก
        </Link>
      </div>
    </div>
  );
}