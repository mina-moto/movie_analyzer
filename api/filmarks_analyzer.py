import glob
import os
import time
import json
import collections as cl
from urllib.request import urlopen
from urllib import request
from bs4 import BeautifulSoup
from page import Page

#指定のURLが存在するか
def is_url(url):
    try:
        f = request.urlopen(url)
        f.close()
        return True
    except request.HTTPError:
        return False

def make_bs_obj(url):
    """
    BeautifulSoupObjectを作成
    """
    html = urlopen(url)
    return BeautifulSoup(html, "html.parser")

# pageに対応したUrl先の映画のタイトルとURL，Jsonに保存
def download_movie_list(page=Page.NOW):
    # data_path = Page.NOW
    # 映画のJson保存用オブジェクト
    movie_json = cl.OrderedDict()
    page_num=0
    movie_page_url=page.value["url"]
    while True:
        page_num+=1
        if page_num==1:
            movie_list_url=movie_page_url
        else:
            movie_list_url=movie_page_url+"?page="+str(page_num)
        # URL先が存在しなければBreak
        if not is_url(movie_list_url):
            break

        # このページのbsオブジェクト
        bs_obj=make_bs_obj(movie_list_url)
        # bsオブジェクトのリスト
        movies = bs_obj.findAll("div", {"class": "p-movie-cassette js-movie-cassette"})

        # このページの各映画のタイトル，URL取得
        for movie in movies:
            title = movie.find("h3").get_text()
            title = title.replace('/', '')  #/をタイトル名からなくすよう変換
            movie_id=str(json.loads(movie["data-clip"])["movie_id"])
            url = "https://filmarks.com/movies/" + movie_id
            # Json保存用データ生成
            movie_data = cl.OrderedDict()
            # movie_data["Title"]=title
            movie_data["URL"] = url
            movie_json[title] = movie_data
    # 小説の情報Json保存
    json_path="./api/data/"+page.value["name"]+"/movie_list.json"
    dir_path = os.path.dirname(json_path)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    with open(json_path, 'w') as fw:
        json.dump(movie_json, fw, indent=4, ensure_ascii=False)

# file_nameのパスへ，textを保存．
def write_text(file_name, text):
    file_path = os.path.dirname(file_name)
    if not os.path.exists(file_path):
        os.makedirs(file_path)
    with open(file_name, 'w') as f:
        f.write(text)

# url先の映画のあらすじダウンロードして返す
def get_main_text(url):
    text = ""
    # res = request.urlopen(url)
    # print(url)
    bs_obj = make_bs_obj(url)
    content_obj=bs_obj.find("content-detail-synopsis")
    if content_obj==None:#あらすじがないやつ
        return ""

    # あらすじのtext
    summary=content_obj[":outline"]
    summary=summary.replace("\"","")
    summary=summary.replace("\\r\\n","\n")#改行コードの文字列を改行コードへ
    # print(summary)
    return summary

# pageに対応したjson_pathの全映画のあらすじダウンロードして保存
def download_main_txt(page=Page.NOW):
    json_path="./api/data/"+page.value["name"]+"/movie_list.json"
    # あらすじの保存先
    summary_path = os.path.dirname(json_path)+"/summary/"

    # 既存のダウンロード済みのあらすじファイルのリスト
    file_path_list = glob.glob(summary_path + "*")
    # ファイル名のみのリスト
    file_name_list = list(
        map(lambda file_path: os.path.basename(file_path), file_path_list))

    # Json上のタイトルの小説ダウンロード(file_name_listにないもののみ)
    f = open(json_path, 'r')
    novel_json = json.load(f)
    for title, json_url in novel_json.items():
        # titleの小説がなければダウンロード
        url = json_url["URL"]
        if not (title in file_name_list):
            # print(url)
            time.sleep(1)
            write_text(summary_path + title, get_main_text(url))

    # Jsonにないタイトルの映画削除
    for file_name in file_name_list:
        if not file_name in list(novel_json.keys()):
            # print(file_name)
            os.remove(summary_path + file_name)


if __name__ == '__main__':
    # download_movie_list(page=Page.NOW.value)
    import time
    start = time.time()
    # for page in Page:
    #     download_movie_list(page)
    #     download_main_txt(page)
    #     print(page)
    page=Page.AMAZON
    # download_movie_list(page=page)
    print("title time")
    print(time.time() - start)
    print("summary time")
    download_main_txt(page=page)
    print(time.time() - start)
