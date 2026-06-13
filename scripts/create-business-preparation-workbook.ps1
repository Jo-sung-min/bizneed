$ErrorActionPreference = "Stop"

$outputDir = Join-Path (Get-Location) "outputs"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$outputPath = [System.IO.Path]::GetFullPath((Join-Path $outputDir "사업준비물_통합관리.xlsx"))

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$workbook = $excel.Workbooks.Add()

$dark = 0x1F2317
$lime = 0x6BF4CA
$light = 0xF1F5F2
$green = 0xD9EEDC
$peach = 0xDCE7F7
$yellow = 0xCDEFFF
$white = 0xFFFFFF

function Add-Sheet([string]$name) {
  $sheet = $workbook.Worksheets.Add()
  $sheet.Name = $name
  $sheet.Cells.Font.Name = "맑은 고딕"
  $sheet.Cells.Font.Size = 10
  $sheet.Activate()
  $excel.ActiveWindow.DisplayGridlines = $false
  return $sheet
}

function Set-Title($sheet, [string]$title, [string]$subtitle, [int]$lastColumn) {
  $sheet.Range($sheet.Cells.Item(1, 1), $sheet.Cells.Item(1, $lastColumn)).Merge()
  $sheet.Cells.Item(1, 1).Value2 = $title
  $sheet.Cells.Item(1, 1).Font.Size = 20
  $sheet.Cells.Item(1, 1).Font.Bold = $true
  $sheet.Cells.Item(1, 1).Font.Color = $white
  $sheet.Cells.Item(1, 1).Interior.Color = $dark
  $sheet.Cells.Item(1, 1).RowHeight = 34
  $sheet.Range($sheet.Cells.Item(2, 1), $sheet.Cells.Item(2, $lastColumn)).Merge()
  $sheet.Cells.Item(2, 1).Value2 = $subtitle
  $sheet.Cells.Item(2, 1).Font.Color = 0x707B75
  $sheet.Cells.Item(2, 1).RowHeight = 27
}

function Set-Headers($sheet, [int]$row, [string[]]$headers) {
  for ($i = 0; $i -lt $headers.Count; $i++) { $sheet.Cells.Item($row, $i + 1).Value2 = $headers[$i] }
  $range = $sheet.Range($sheet.Cells.Item($row, 1), $sheet.Cells.Item($row, $headers.Count))
  $range.Font.Bold = $true
  $range.Font.Color = $white
  $range.Interior.Color = $dark
  $range.RowHeight = 26
  $range.WrapText = $true
  $range.AutoFilter() | Out-Null
}

function Style-Body($sheet, [int]$startRow, [int]$endRow, [int]$lastColumn) {
  $range = $sheet.Range($sheet.Cells.Item($startRow, 1), $sheet.Cells.Item($endRow, $lastColumn))
  $range.Borders.Color = 0xE2E7E3
  $range.Borders.Weight = 2
  $range.VerticalAlignment = -4160
  $range.WrapText = $true
  for ($row = $startRow; $row -le $endRow; $row++) {
    if ($row % 2 -eq 0) { $sheet.Range($sheet.Cells.Item($row, 1), $sheet.Cells.Item($row, $lastColumn)).Interior.Color = $light }
  }
}

function Add-StatusValidation($range) {
  $range.Validation.Delete()
  $range.Validation.Add(3, 1, 1, "미시작,진행중,완료,보류")
}

function Add-UrlHyperlinks($sheet, [int]$column, [int]$startRow, [int]$endRow) {
  for ($row = $startRow; $row -le $endRow; $row++) {
    $cell = $sheet.Cells.Item($row, $column)
    if ($cell.Value2) { $sheet.Hyperlinks.Add($cell, $cell.Value2, "", "", $cell.Value2) | Out-Null }
  }
}

# Remove default sheets after adding all required sheets.
$dashboard = Add-Sheet "대시보드"
$profit = Add-Sheet "01_제품손익"
$foundation = Add-Sheet "02_사업기반"
$brand = Add-Sheet "03_브랜드자산"
$supplier = Add-Sheet "04_공급처"
$sample = Add-Sheet "05_샘플품질"
$customs = Add-Sheet "06_수입통관"
$cert = Add-Sheet "07_인증표시"
$sales = Add-Sheet "08_판매채널"
$inventory = Add-Sheet "09_재고배송"
$risk = Add-Sheet "10_운영위험"
$checklist = Add-Sheet "11_실행체크"
$official = Add-Sheet "12_공식확인처"

while ($workbook.Worksheets.Count -gt 13) { $workbook.Worksheets.Item($workbook.Worksheets.Count).Delete() }

# 01 Product profitability
Set-Title $profit "제품별 손익 계산" "노란색 입력칸을 채우면 실제 입고원가, 예상이익, 이익률과 손익분기 판매량이 자동 계산됩니다." 25
$profitHeaders = @("제품코드","제품명","판매가","제품대금","중국내운송","검수비","국제운송","관세","수입부가세","통관수수료","인증시험비","포장라벨","국내입고비","실제입고원가","판매수수료","결제수수료","국내배송비","광고비","반품불량충당","기타운영비","개당예상이익","이익률","첫발주수량","첫발주총비용","손익분기판매량")
Set-Headers $profit 4 $profitHeaders
Style-Body $profit 5 54 25
$profit.Range("A5:M54").Interior.Color = $yellow
$profit.Range("O5:T54").Interior.Color = $yellow
$profit.Range("W5:W54").Interior.Color = $yellow
$profit.Range("N5").Formula = '=IF(B5="","",SUM(D5:M5))'
$profit.Range("N5:N54").FillDown()
$profit.Range("U5").Formula = '=IF(B5="","",C5-N5-SUM(O5:T5))'
$profit.Range("U5:U54").FillDown()
$profit.Range("V5").Formula = '=IFERROR(U5/C5,0)'
$profit.Range("V5:V54").FillDown()
$profit.Range("X5").Formula = '=IF(B5="","",N5*W5)'
$profit.Range("X5:X54").FillDown()
$profit.Range("Y5").Formula = '=IFERROR(ROUNDUP(X5/(C5-SUM(O5:T5)),0),0)'
$profit.Range("Y5:Y54").FillDown()
$profit.Range("C5:U54").NumberFormat = '#,##0"원"'
$profit.Range("V5:V54").NumberFormat = '0.0%'
$profit.Range("X5:X54").NumberFormat = '#,##0"원"'
$profit.Cells.Item(5,1).Value2="P-001"; $profit.Cells.Item(5,2).Value2="예시 제품"; $profit.Cells.Item(5,3).Value2=30000; $profit.Cells.Item(5,4).Value2=7000; $profit.Cells.Item(5,7).Value2=1800; $profit.Cells.Item(5,8).Value2=500; $profit.Cells.Item(5,9).Value2=930; $profit.Cells.Item(5,12).Value2=500; $profit.Cells.Item(5,15).Value2=3000; $profit.Cells.Item(5,17).Value2=3000; $profit.Cells.Item(5,18).Value2=2500; $profit.Cells.Item(5,19).Value2=700; $profit.Cells.Item(5,23).Value2=100
$profit.Range("A4:Y4").EntireColumn.ColumnWidth = 13
$profit.Columns.Item("B").ColumnWidth = 20
$profit.Range("A5").Select(); $excel.ActiveWindow.FreezePanes = $true

# Reusable tracker sheets
Set-Title $foundation "사업 운영 기반" "사업자등록, 사업용 금융수단과 증빙 보관 위치를 기록하세요." 8
Set-Headers $foundation 4 @("구분","항목","상태","완료일","문서번호·계정","보관 위치","관련 URL","메모")
$foundationData = @(
  @("사업자","사업자등록","진행중","","","","https://www.hometax.go.kr","업종 코드와 과세 유형 확인"),
  @("금융","사업용 계좌","미시작","","","","","입금용·지출용 분리 권장"),
  @("금융","사업용 카드","미시작","","","","https://www.hometax.go.kr","홈택스 등록"),
  @("통관","사업자 통관고유부호","미시작","","","","https://www.customs.go.kr","개인통관고유부호와 구분"),
  @("증빙","제품별 증빙 폴더","미시작","","","","","견적서·인보이스·송금증·수입신고필증")
)
$foundation.Range("A5:H9").Value2 = $foundationData
Style-Body $foundation 5 34 8; Add-StatusValidation $foundation.Range("C5:C34"); Add-UrlHyperlinks $foundation 7 5 9

Set-Title $brand "브랜드·지식재산·도메인" "브랜드 후보 조사, 출원 현황, 도메인과 SNS 계정을 한곳에서 관리하세요." 11
Set-Headers $brand 4 @("브랜드명","구분","검색·출원일","상태","지정상품·채널","출원번호·계정","구매처","관리 URL","연결 URL","갱신일","메모")
$brand.Range("A5:K34").Interior.Color = $yellow
$brand.Cells.Item(5,1).Value2="예시 브랜드"; $brand.Cells.Item(5,2).Value2="도메인"; $brand.Cells.Item(5,4).Value2="진행중"; $brand.Cells.Item(5,7).Value2="가비아"; $brand.Cells.Item(5,8).Value2="https://my.gabia.com"
Style-Body $brand 5 34 11; Add-StatusValidation $brand.Range("D5:D34"); Add-UrlHyperlinks $brand 8 5 5

Set-Title $supplier "중국 공급처 관리" "공급처 URL, 연락처, MOQ, 견적과 대응 품질을 비교해 최종 공급처를 선정하세요." 16
Set-Headers $supplier 4 @("공급처명","사이트","상품 URL","담당자","연락수단","공장여부","MOQ","샘플단가","대량단가","납기일수","수출경험","인증서확인","불량대응","결제조건","평가점수","메모")
$supplier.Range("A5:P54").Interior.Color = $yellow
$supplier.Cells.Item(5,1).Value2="예시 공급처"; $supplier.Cells.Item(5,2).Value2="1688"; $supplier.Cells.Item(5,3).Value2="https://www.1688.com"; $supplier.Cells.Item(5,6).Value2="확인필요"; $supplier.Cells.Item(5,7).Value2=100; $supplier.Cells.Item(5,15).Value2=3
Style-Body $supplier 5 54 16
$supplier.Range("F5:F54").Validation.Add(3,1,1,"공장,유통업체,확인필요")
$supplier.Range("L5:L54").Validation.Add(3,1,1,"확인완료,확인중,없음")
$supplier.Range("O5:O54").Validation.Add(1,1,1,1,5)
Add-UrlHyperlinks $supplier 3 5 5

Set-Title $sample "샘플·품질 기준서" "샘플 검수 결과와 대량 생산 시 적용할 품질 기준을 제품별로 기록하세요." 14
Set-Headers $sample 4 @("제품코드","공급처","샘플수령일","검사항목","기준값","측정값","결과","불량유형","사진·자료 URL","로고위치","포장방식","바코드","개선요청","메모")
$sample.Range("A5:N54").Interior.Color = $yellow
Style-Body $sample 5 54 14
$sample.Range("G5:G54").Validation.Add(3,1,1,"합격,조건부합격,불합격,미검사")

Set-Title $customs "수입·통관 관리" "제품별 HS 코드, 관세율, 관세사·포워더와 운송 조건을 기록하세요." 15
Set-Headers $customs 4 @("제품코드","제품명","HS코드","관세율","수입가능여부","필요인증","원산지표시","인코텀즈","관세사","관세사 URL","포워더","포워더 URL","예상운송비","예상통관일","메모")
$customs.Range("A5:O54").Interior.Color = $yellow
Style-Body $customs 5 54 15
$customs.Range("D5:D54").NumberFormat = "0.0%"
$customs.Range("E5:E54").Validation.Add(3,1,1,"확인완료,확인중,수입불가")
$customs.Range("H5:H54").Validation.Add(3,1,1,"EXW,FOB,CIF,DDP,기타")
$customs.Range("M5:M54").NumberFormat = '#,##0"원"'

Set-Title $cert "인증·원산지·한글 표시" "제품별 법정 인증과 표시사항 준비 현황, 인증서 위치를 관리하세요." 13
Set-Headers $cert 4 @("제품코드","제품명","인증구분","대상여부","기관·시험소","기관 URL","예상비용","신청일","완료일","인증번호","표시사항상태","인증서 위치","메모")
$cert.Range("A5:M54").Interior.Color = $yellow
Style-Body $cert 5 54 13
$cert.Range("D5:D54").Validation.Add(3,1,1,"대상,비대상,확인중")
$cert.Range("K5:K54").Validation.Add(3,1,1,"미작성,작성중,검수완료")
$cert.Range("G5:G54").NumberFormat = '#,##0"원"'

Set-Title $sales "판매 채널·가격·콘텐츠" "채널별 수수료와 정산주기, 가격 정책, 상세페이지 준비 상태를 비교하세요." 15
Set-Headers $sales 4 @("채널명","스토어 URL","입점상태","판매제품","판매가","판매수수료율","결제수수료율","광고예산","정산주기","통신판매업표시","상세페이지상태","정상가","행사최저가","손절가","메모")
$sales.Range("A5:O54").Interior.Color = $yellow
Style-Body $sales 5 54 15
$sales.Range("C5:C54").Validation.Add(3,1,1,"미신청,심사중,입점완료,운영중")
$sales.Range("K5:K54").Validation.Add(3,1,1,"미작성,작성중,검수완료")
$sales.Range("E5:E54").NumberFormat = '#,##0"원"'; $sales.Range("F5:G54").NumberFormat = "0.0%"; $sales.Range("H5:H54").NumberFormat = '#,##0"원"'; $sales.Range("L5:N54").NumberFormat = '#,##0"원"'

Set-Title $inventory "재고·배송·반품 관리" "SKU별 재고, 재주문 시점, 배송과 반품 정책을 기록하세요." 15
Set-Headers $inventory 4 @("SKU","제품명","옵션","현재재고","안전재고","재주문점","발주중수량","입고예정일","창고위치","택배사","출고마감","반품지","왕복배송비","불량재고","메모")
$inventory.Range("A5:O104").Interior.Color = $yellow
Style-Body $inventory 5 104 15
$inventory.Range("M5:M104").NumberFormat = '#,##0"원"'
$inventory.Range("D5:D104").FormatConditions.Add(1,5,"=F5") | Out-Null
$inventory.Range("D5:D104").FormatConditions.Item(1).Interior.Color = 0xB7C9FF

Set-Title $risk "판매 후 운영·위험 관리" "CS, 불량, 사고, 리콜, 세금과 현금 흐름 이슈를 기록하세요." 14
Set-Headers $risk 4 @("발생일","유형","주문번호","SKU","문제내용","사진·자료 URL","처리결과","발생비용","공급처보상","판매중지여부","로트번호","담당자","상태","메모")
$risk.Range("A5:N104").Interior.Color = $yellow
Style-Body $risk 5 104 14
$risk.Range("B5:B104").Validation.Add(3,1,1,"고객문의,불량,반품,안전사고,리콜,세금,현금흐름,기타")
$risk.Range("M5:M104").Validation.Add(3,1,1,"접수,처리중,완료,보류")
$risk.Range("H5:I104").NumberFormat = '#,##0"원"'

# Checklist
Set-Title $checklist "실행 순서 체크리스트" "사업준비물 안내의 실행 항목을 순서대로 완료하세요. 상태는 대시보드에 자동 반영됩니다." 7
Set-Headers $checklist 4 @("단계","분류","할 일","상태","담당자","목표일","메모")
$tasks = @(
@("발주 전","제품·손익","판매 제품과 고객 정의","미시작","","",""),@("발주 전","제품·손익","경쟁 제품·가격·후기 조사","미시작","","",""),@("발주 전","제품·손익","제품별 실제 입고원가와 예상이익 계산","미시작","","",""),@("발주 전","사업 기반","사업자등록 및 사업용 계좌 준비","미시작","","",""),@("발주 전","브랜드","브랜드명 선행 조사","미시작","","",""),@("발주 전","브랜드","상표 출원 가능성 검토","미시작","","",""),@("발주 전","브랜드","핵심 도메인과 SNS 아이디 확보","미시작","","",""),@("발주 전","공급처","샘플 주문과 품질 테스트","미시작","","",""),@("발주 전","통관","HS 코드와 수입 가능 여부 확인","미시작","","",""),@("발주 전","인증","제품별 인증 요건 확인","미시작","","",""),@("발주 전","표시","원산지·한글 표시사항 확정","미시작","","",""),@("발주 전","통관","사업자 통관고유부호 준비","미시작","","",""),@("발주 전","물류","관세사·포워더 견적 비교","미시작","","",""),@("발주 전","공급처","공급 계약과 불량 대응 조건 확정","미시작","","",""),
@("출고 전","제품","최종 제품 사양서 확정","미시작","","",""),@("출고 전","브랜드","로고·포장·라벨 시안 확인","미시작","","",""),@("출고 전","인증","필요한 인증서와 시험 결과 확인","미시작","","",""),@("출고 전","품질","출고 전 수량·품질 검사","미시작","","",""),@("출고 전","증빙","인보이스와 패킹리스트 확인","미시작","","",""),@("출고 전","물류","운송 조건과 보험 확인","미시작","","",""),@("출고 전","통관","통관 예상 비용과 국내 입고 일정 확인","미시작","","",""),
@("판매 전","신고","통신판매업 신고 대상 여부 확인","미시작","","",""),@("판매 전","채널","판매 채널 개설과 수수료 확인","미시작","","",""),@("판매 전","콘텐츠","상세페이지 법정 표시사항 확인","미시작","","",""),@("판매 전","정책","배송·교환·반품 정책 작성","미시작","","",""),@("판매 전","재고","SKU·바코드·재고표 준비","미시작","","",""),@("판매 전","CS","고객 문의 대응 문구 준비","미시작","","",""),@("판매 전","개인정보","개인정보처리방침과 이용약관 준비","미시작","","",""),@("판매 전","증빙","세금·매입·통관 증빙 보관 체계 준비","미시작","","","")
)
$checklist.Range("A5:G33").Value2 = $tasks
Style-Body $checklist 5 33 7
Add-StatusValidation $checklist.Range("D5:D33")

# Official sources
Set-Title $official "공식 확인처·유용한 사이트" "정보는 변경될 수 있으므로 실제 발주와 신고 전 공식 기관 및 전문가에게 최종 확인하세요." 5
Set-Headers $official 4 @("구분","사이트명","확인 내용","URL","확인 메모")
$links = @(
@("사업·세금","국세청 홈택스","사업자등록, 사업용 신용카드, 세금 신고","https://www.hometax.go.kr",""),
@("민원","정부24","통신판매업 신고 등 민원 안내","https://www.gov.kr",""),
@("통관","관세청","수입 통관 및 통관고유부호","https://www.customs.go.kr",""),
@("통관","관세법령정보포털","품목분류, 관세율, 수입 요건","https://unipass.customs.go.kr/clip/index.do",""),
@("인증","제품안전정보센터","KC 등 제품 안전 정보","https://www.safetykorea.kr",""),
@("식품","식품안전나라","식품 관련 수입·표시 정보","https://www.foodsafetykorea.go.kr",""),
@("전파","국립전파연구원","방송통신기자재 적합성평가","https://www.rra.go.kr",""),
@("지식재산","키프리스","상표·특허·디자인 선행 검색","https://www.kipris.or.kr",""),
@("지식재산","특허로","상표·특허·디자인 전자출원","https://www.patent.go.kr",""),
@("공급처","1688","중국 도매 공급처 조사","https://www.1688.com",""),
@("공급처","Alibaba","중국·글로벌 공급처 조사","https://www.alibaba.com",""),
@("도메인","가비아","도메인 구매 및 관리","https://www.gabia.com","")
)
$official.Range("A5:E16").Value2 = $links
Style-Body $official 5 25 5
Add-UrlHyperlinks $official 4 5 16

# Dashboard
Set-Title $dashboard "사업 준비 통합 대시보드" "각 탭에 정보를 입력하면 주요 현황과 실행 체크리스트 진행률을 한눈에 확인할 수 있습니다." 10
$dashboard.Range("A4:B4").Merge(); $dashboard.Cells.Item(4,1).Value2="전체 체크리스트 진행률"; $dashboard.Cells.Item(4,1).Font.Bold=$true
$dashboard.Range("A5:B7").Merge(); $dashboard.Cells.Item(5,1).Formula='=COUNTIF(''11_실행체크''!D5:D33,"완료")/COUNTA(''11_실행체크''!C5:C33)'; $dashboard.Cells.Item(5,1).NumberFormat="0%"; $dashboard.Cells.Item(5,1).Font.Size=28; $dashboard.Cells.Item(5,1).Font.Bold=$true; $dashboard.Cells.Item(5,1).Interior.Color=$green
$dashboard.Range("D4:E4").Merge(); $dashboard.Cells.Item(4,4).Value2="등록 제품 수"; $dashboard.Range("D5:E7").Merge(); $dashboard.Cells.Item(5,4).Formula='=COUNTA(''01_제품손익''!B5:B54)'; $dashboard.Cells.Item(5,4).Font.Size=28; $dashboard.Cells.Item(5,4).Font.Bold=$true; $dashboard.Cells.Item(5,4).Interior.Color=$peach
$dashboard.Range("G4:H4").Merge(); $dashboard.Cells.Item(4,7).Value2="등록 공급처 수"; $dashboard.Range("G5:H7").Merge(); $dashboard.Cells.Item(5,7).Formula='=COUNTA(''04_공급처''!A5:A54)'; $dashboard.Cells.Item(5,7).Font.Size=28; $dashboard.Cells.Item(5,7).Font.Bold=$true; $dashboard.Cells.Item(5,7).Interior.Color=$yellow
$dashboard.Range("A10:D10").Value2=@("상태","개수","","")
$dashboard.Range("A11:B14").Value2=@(@("완료",""),@("진행중",""),@("미시작",""),@("보류",""))
$dashboard.Cells.Item(11,2).Formula='=COUNTIF(''11_실행체크''!D5:D33,A11)'; $dashboard.Range("B11:B14").FillDown()
$dashboard.Range("A17:J17").Merge(); $dashboard.Cells.Item(17,1).Value2="사용 순서"; $dashboard.Cells.Item(17,1).Font.Bold=$true; $dashboard.Cells.Item(17,1).Interior.Color=$dark; $dashboard.Cells.Item(17,1).Font.Color=$white
$dashboard.Range("A18:J22").Value2=@(
@("1","01_제품손익","후보 제품별 비용과 판매가를 입력해 수익성을 비교합니다.","","","","","","",""),
@("2","04_공급처 / 05_샘플품질","공급처 URL과 견적을 기록하고 샘플 검수 결과를 비교합니다.","","","","","","",""),
@("3","06_수입통관 / 07_인증표시","발주 전에 HS 코드, 인증과 표시 의무를 확인합니다.","","","","","","",""),
@("4","08_판매채널 / 09_재고배송","판매가, 수수료, 재고와 반품 정책을 준비합니다.","","","","","","",""),
@("5","11_실행체크","완료한 항목의 상태를 변경해 진행률을 관리합니다.","","","","","","","")
)
Style-Body $dashboard 18 22 10
$chart = $dashboard.Shapes.AddChart2(251, 5, 360, 78, 430, 250).Chart
$chart.SetSourceData($dashboard.Range("A10:B14"))
$chart.HasTitle = $true; $chart.ChartTitle.Text = "체크리스트 상태"
$dashboard.Columns.Item("A:J").ColumnWidth = 15
$dashboard.Columns.Item("C").ColumnWidth = 38

# Global sheet formatting
foreach ($sheet in $workbook.Worksheets) {
  $used = $sheet.UsedRange
  $used.Rows.AutoFit() | Out-Null
  if ($sheet.Name -ne "대시보드") {
    $sheet.Columns.AutoFit() | Out-Null
    for ($c=1; $c -le $used.Columns.Count; $c++) {
      if ($sheet.Columns.Item($c).ColumnWidth -gt 28) { $sheet.Columns.Item($c).ColumnWidth = 28 }
      if ($sheet.Columns.Item($c).ColumnWidth -lt 11) { $sheet.Columns.Item($c).ColumnWidth = 11 }
    }
    $sheet.Range("A5").Select()
    $excel.ActiveWindow.FreezePanes = $true
  }
}

$dashboard.Activate()
$workbook.SaveAs($outputPath, 51)
$workbook.Close($true)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($workbook) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
Write-Output $outputPath
