# COPYRIGHT (C) 2025 Bình Ta gi lơ 
# This program is free software: you can redistribute it and/or modify
# DÒNG NÀY ĐÁNH DẤU CHỦ QUYỀN ĐÂY LÀ CODE CỦA MỘT THẰNG CODER 17 TUỔI ĐANG KHỔ DÂM VỚI VÀI CÁI PROJECT TO VÃI QUẠC :v VUI LÒNG K XOÁ ĐỂ BÀY TỎ LÒNG TÔN TRỌNG VỚI MỘT CODER KIÊM SĨ TỬ LƯƠNG CHƯA ĐỦ NUÔI THIÊN AN TRƯỚC LẠM PHÁT :)))

import os
import datetime
import google.generativeai as genai
from docxtpl import DocxTemplate
import sys

# Màu cho terminal
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m' 
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

def print_header():
    """Công cụ chuyển form docx với gemini by Bình Ta gi lơ (Not Ta li ga) """
    print(f"\n{Colors.BOLD}{Colors.HEADER}=================================================={Colors.END}")
    print(f"{Colors.BOLD}{Colors.HEADER}   BINH TAGILLA (NOT TA LI GA)  {Colors.END}")
    print(f"{Colors.BOLD}{Colors.HEADER}=================================================={Colors.END}")
  
def find_template_variables(doc_file):
    """Tìm biến trong file Word"""
    try:
        print(f"{Colors.BLUE}🔍 Đang tìm biến trong file: {doc_file}{Colors.END}")
        
        if not os.path.exists(doc_file):
            print(f"{Colors.RED}❌ Không thấy file! Kiểm tra lại tên nhé.{Colors.END}")
            return None
            
        doc = DocxTemplate(doc_file)
        variables = doc.get_undeclared_template_variables()
        
        if variables:
            print(f"{Colors.GREEN}✨ Tìm được {len(variables)} biến rồi!{Colors.END}")
            return sorted(variables)
        else:
            print(f"{Colors.YELLOW}⚠️ Hình như file này không có biến nào...{Colors.END}")
            print(f"{Colors.YELLOW}🔔 Check lại xem có phải file mẫu không nhé?{Colors.END}")
            return None
            
    except Exception as e:
        print(f"{Colors.RED}❌ Lỗi đọc file: {str(e)}{Colors.END}")
        return None

def configure_gemini(api_key):
    """Cài đặt API Gemini"""
    try:
        genai.configure(api_key=api_key)
        
        config = {
            "temperature": 0.3,
            "top_p": 1,
            "top_k": 40,
            "max_output_tokens": 4096,
        }
        
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=config
        )
        
        print(f"{Colors.GREEN}✅ Ok! Kết nối Gemini thành công rồi!{Colors.END}")
        return model
        
    except Exception as e:
        print(f"{Colors.RED}❌ Lỗi kết nối: {str(e)}{Colors.END}")
        return None

def generate_content(model, prompt, variables):
    """Tạo nội dung cho các biến"""
    try:
        print(f"{Colors.BLUE}⏳ Đang nhờ Gemini viết nội dung...{Colors.END}")
        
        main_prompt = f"""
        Bạn là trợ lý giúp điền form. Dựa vào yêu cầu:
        
        "{prompt}"
        
        Tạo nội dung cho các trường sau trong form nhé.
        Trả về dạng JSON với các trường tương ứng.
        Viết ngắn gọn, dễ hiểu, đúng tiếng Việt.
        
        Các trường cần điền: {", ".join(variables)}
        """
        
        response = model.generate_content(main_prompt)
        
        try:
            import json
            import re
            
            content = response.text
            json_pattern = r'\{[\s\S]*\}'
            json_match = re.search(json_pattern, content)
            
            if json_match:
                json_str = json_match.group(0)
                data = json.loads(json_str)
                
                missing = [var for var in variables if var not in data]
                if missing:
                    print(f"{Colors.YELLOW}⚠️ Còn thiếu {len(missing)} trường. Để lấy thêm...{Colors.END}")
                    
                    for var in missing:
                        var_prompt = f"""
                        Theo yêu cầu: "{prompt}"
                        
                        Viết nội dung ngắn gọn cho trường "{var}".
                        Chỉ cần trả về nội dung thôi nhé.
                        """
                        var_response = model.generate_content(var_prompt)
                        data[var] = var_response.text.strip()
                
                return data
            else:
                print(f"{Colors.YELLOW}⚠️ Không thấy JSON. Thử cách khác vậy...{Colors.END}")
                return generate_content_manually(model, prompt, variables)
                
        except Exception as e:
            print(f"{Colors.YELLOW}⚠️ Lỗi xử lý: {str(e)}{Colors.END}")
            print(f"{Colors.YELLOW}⚠️ Thử cách thứ 2 vậy...{Colors.END}")
            return generate_content_manually(model, prompt, variables)
            
    except Exception as e:
        print(f"{Colors.RED}❌ Lỗi gọi Gemini: {str(e)}{Colors.END}")
        return None

def generate_content_manually(model, prompt, variables):
    """Tạo nội dung từng biến một"""
    content = {}
    
    print(f"{Colors.BLUE}⏳ Đang tạo nội dung từng phần...{Colors.END}")
    
    for var in variables:
        try:
            var_prompt = f"""
            Giúp điền form nhé. Theo yêu cầu:
            
            "{prompt}"
            
            Viết nội dung cho trường "{var}".
            Ngắn gọn, dễ hiểu, đúng tiếng Việt.
            Chỉ cần nội dung thôi nhé.
            """
            
            print(f"  Đang viết cho phần: {var}...")
            response = model.generate_content(var_prompt)
            content[var] = response.text.strip()
            
        except Exception as e:
            print(f"{Colors.RED}❌ Lỗi phần {var}: {str(e)}{Colors.END}")
            content[var] = f"[Lỗi: Chưa tạo được]"
    
    return content

def render_template(template_file, output_file, context):
    """Điền form và lưu file"""
    try:
        doc = DocxTemplate(template_file)
        doc.render(context)
        doc.save(output_file)
        
        print(f"{Colors.GREEN}✅ Xong! Đã lưu file: {output_file}{Colors.END}")
        return True
        
    except Exception as e:
        print(f"{Colors.RED}❌ Lỗi lưu file: {str(e)}{Colors.END}")
        return False

def main():
    """Chạy chương trình"""
    print_header()
    
    template_file = input(f"{Colors.YELLOW}Nhập tên file Word (VD: mau_don.docx): {Colors.END}").strip()
    if not template_file:
        print(f"{Colors.RED}❌ Chưa nhập tên file kìa.{Colors.END}")
        return
    
    variables = find_template_variables(template_file)
    if not variables:
        return
    
    print(f"\n{Colors.BLUE}📋 Các biến tìm được:{Colors.END}")
    for i, var in enumerate(variables, 1):
        print(f"  {i}. {{{{ {var} }}}}")
    
    api_key = input(f"\n{Colors.YELLOW}Nhập API key Gemini (hoặc Enter để dùng GOOGLE_API_KEY): {Colors.END}").strip()
    if not api_key:
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            print(f"{Colors.RED}❌ Chưa có API key.{Colors.END}")
            return
    
    model = configure_gemini(api_key)
    if not model:
        return
    
    print(f"\n{Colors.BLUE}📝 Nhập yêu cầu để AI viết nội dung:{Colors.END}")
    print(f"{Colors.YELLOW}VD: Viết đơn xin nghỉ 3 ngày từ 15/7-17/7 cho Nguyễn Văn A vì việc riêng{Colors.END}")
    prompt = input(f"\n{Colors.BOLD}Yêu cầu của bạn: {Colors.END}")
    
    if not prompt:
        print(f"{Colors.RED}❌ Chưa nhập yêu cầu kìa.{Colors.END}")
        return
    
    content = generate_content(model, prompt, variables)
    if not content:
        return
    
    print(f"\n{Colors.BLUE}📋 Nội dung đã viết:{Colors.END}")
    for var, text in content.items():
        print(f"  {Colors.BOLD}{{{{ {var} }}}} = {Colors.END}{text}")
    
    ok = input(f"\n{Colors.YELLOW}Điền form luôn nhé? (y/n): {Colors.END}").strip().lower()
    if ok != 'y':
        print(f"{Colors.YELLOW}🔔 Ok, không điền.{Colors.END}")
        return
    
    time = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output = f"{os.path.splitext(template_file)[0]}_{time}.docx"
    
    if render_template(template_file, output, content):
        print(f"\n{Colors.GREEN}🎉 Xong rồi! File mới: {output}{Colors.END}")
        
        edit = input(f"\n{Colors.YELLOW}Muốn sửa lại không? (y/n): {Colors.END}").strip().lower()
        if edit == 'y':
            print(f"\n{Colors.BLUE}Chạy lại chương trình và sửa yêu cầu nhé!{Colors.END}")

if __name__ == "__main__":
    main()  

