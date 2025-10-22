"use client";
 
import Image from "next/image";
import logo from "./../../assets/logo.png";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { firebase } from "../../lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
 
export default function Page() {
  const router = useRouter();
 
  //สร้างตัวแปร state เพื่อผูกกับข้อมูลที่เกิดขึ้นที่หน้าจอ และบันทึกลงฐานข้อมูล
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [is_completed, setIsCompleted] = useState<boolean>(false);
  const [image_file, setImageFile] = useState<File | null>(null);
  const [preview_file, setPreviewFile] = useState<string | null>(null);
 
  //ฟังก์ชันเลือกรูปเพื่อพรีวิวก่อนที่จะอัปโหลด
  function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
 
    setImageFile(file);
 
    if(file){
      setPreviewFile(URL.createObjectURL(file as Blob));
    }
  }
 
  //ฟังก์ชันอัปโหลดรูปภาพ และบันทึกข้อมูลลงฐานข้อมูลที่ Supabase
  async function handleUploadAndSave(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      //---- Validate ------
      if(title.trim() === "" || detail.trim() === ""){
        alert("กรุณาตรวจสอบการป้อนข้อมูลงานที่ทำ และรายละเอียดงาน")
        return
      }
 
      //---------- อัปโหลดรูป --------
      //โดยตรวจสอบก่อนว่าผู้ใช้ได้เลือกรูปหรือไม่ หากเลือกก็อัปโหลด หากไม่เลือกก็ไม่ต้องอัปโหลด
      //สร้างตัวแปรเพื่อเก็บ url ของรูปที่อัปโหลด เพื่อจะเอาไปบันทึกลงตาราง
      let image_url = "";
 
      //ตรวจสอบว่าได้มีการเลือกรูปเพื่อที่จะอัปโหลดหรือไม่
      if(image_file){
        //กรณีมีการเลือกรูป ก็จะทําการอัปโหลดรูปไปยัง Storage ของ Supabase
        //ตั้งชื่อไฟล์ใหม่ เพื่อไม่ให้รูปที่อัปโหลดมีชื่อซ้ํากัน
        const new_image_file_name = `${Date.now()}-${image_file.name}`;
 
        //อัปโหลดรูปไปยัง Storage
        const {data, error} = await supabase.storage
          .from("task_bk")
          .upload(new_image_file_name, image_file)
 
        //หลังจากอัปโหลดรูปไปยัง Storage ให้ตรวจสอบว่าสำเร็จหรือไม่
        //มี error แสดง Alert หากไม่มี error ให้ get url ของรูปที่อัปโหลดเก็บไว้ในตัวแปรที่สร้างไว้ image_url
        if( error ){
          //แสดง Alert
          alert("พบปัญหาในการอัปโหลด กรุณาตรวจสอบและลองใหม่อีกครั้ง")
          console.log(error.message);
          return;
        }else{
          // get url ของรูปที่
          const { data } =  supabase.storage
            .from("task_bk")
            .getPublicUrl(new_image_file_name)        
          image_url = data.publicUrl
        }
      }      
 
      //---------- บันทึกข้อมูลลงคอลเล็กชัน task ใน Firebase --------
      try{
        const result = await addDoc(collection(firebase, "task"),{
          title: title,
          detail: detail,
          is_completed: is_completed,
          image_url: image_url
        })
 
        if(result){
          alert("บันทึกข้อมูลสําเร็จ")
          router.push("/alltask")
        }else{
          alert('พบปัญหาในการบันทึก กรุณาตรวจสอบและลองใหม่อีกครั้ง')
        }
      }catch(error){
        alert('พบปัญหาในการบันทึก กรุณาตรวจสอบและลองใหม่อีกครั้ง')
        console.log(error);
      }
  }
   
 
  return (
    <div className="flex flex-col w-6/12 mx-auto">
      {/* ส่วนหัว */}
      <div className="flex flex-col items-center mt-20">
        <Image src={logo} alt="logo" width={100} height={100} />
        <h1 className="text-xl font-bold mt-5">Manage Task App (Firebase)</h1>
        <h1 className="text-xl font-bold">บันทึกงานที่ต้องทำ</h1>
      </div>
 
      {/* ส่วนของการเพิ่มงานใหม่ */}
      <div className="mt-10 flex flex-col border border-gray-300 p-5 rounded-xl">
          <h1 className="text-center text-xl font-bold">➕ เพิ่มงานใหม่</h1>
 
          <form onSubmit={handleUploadAndSave}>
            <div className="flex flex-col mt-5">
              <label className="text-lg font-bold">งานที่ทำ</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}  className="border border-gray-300 rounded-lg p-2" />
            </div>
 
            <div className="flex flex-col mt-5">
              <label className="text-lg font-bold">รายละเอียดงาน</label>
              <textarea value={detail} onChange={(e) => setDetail(e.target.value)} className="border border-gray-300 rounded-lg p-2">
              </textarea>
            </div>
 
            <div className="flex flex-col mt-5">
              <label className="text-lg font-bold">อัปโหลดรูปภาพ</label>          
              <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={handleSelectImagePreview}/>
              <label htmlFor="fileInput" className="bg-blue-500 rounded-lg p-2 text-white
                                                      cursor-pointer w-30 text-center">
                เลือกรูป
              </label>
 
              {preview_file && (
                <div className="mt-3">
                  <Image src={preview_file} alt="preview" width={100} height={100} />
                </div>
              )}
            </div>
 
            <div className="flex flex-col mt-5">
              <label className="text-lg font-bold">สถานะงาน</label>
              <select className="border border-gray-300 rounded-lg p-2"
                      value = {is_completed ? "1" : "0"}
                      onChange={(e) => setIsCompleted(e.target.value === "1")}>
                <option value="0">ยังไม่เสร็จสิ้น</option>
                <option value="1">เสร็จสิ้น</option>
              </select>
            </div>
 
            <div className="flex flex-col mt-5">
              <button type="submit" className="bg-green-500 rounded-lg p-2 text-white">บันทึกเพิ่มงาน</button>
            </div>
          </form>    
 
      </div>
 
      {/* ส่วนของลิงค์กลับไปหน้าแสดงงานทั้งหมด */}        
      <div className="flex justify-center mt-10">
          <Link href="/alltask" className="text-blue-600 font-bold">
           กลับไปแสดงงานทั้งหมด
          </Link>
      </div>      
    </div>
  );
}