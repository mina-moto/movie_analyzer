import os
import sys
import MeCab
from gensim import models
import json
from gensim.models.doc2vec import LabeledSentence
from page import Page
import glob
import random

# pageに適した映画のあらすじのデータセットを作成．空の場合は作らない,{"タイトル":"あらすじ"}
def generate_summary_data_set(page=Page.NOW):
    summary_data_set = {}
    title_path_list = glob.glob(
        './api/data/' + page.value["name"] + '/summary/*')
    for title_path in title_path_list:
        with open(title_path) as f:
            summary = f.read()
        if len(summary) == 0:
            continue
        title = os.path.basename(title_path)
        summary_data_set[title] = summary
    return summary_data_set

# 引数のデータセット，ベクトル計算してJson形式で保存後，辞書型で返す
# {タイトル:[1,...,300]}
def calc_movie_to_vec(summary_data_set,page=Page.NOW):
    result_300d = {}
    # doc2vecで推論する
    inferred_data = [0] * 300
    # 結果格納
    for title, summary_data in summary_data_set.items():
        result_300d[title] = inferred_data

    # 保存先のpath，なければフォルダ作成(result_2dも同様の場所).
    save_path="./api/data/" + page.value["name"]+"/result/result_300d.json"
    dir_path = os.path.dirname(save_path)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    with open(save_path,"w") as f:
        json.dump(result_300d,f,indent=4,ensure_ascii=False)
    return result_300d

# pca分析を行い2Dに次元削減しJson形式で結果保存
# {"chartData":{"datasets":[{"data":[{"x":double,"y":double,"l":"タイトル"}...]}]}}
def calc_pca_2d(result_300d,page=Page.NOW):
    data = []
    for title, vec in result_300d.items():
        data.append({"x": random.gauss(30, 5),
                    "y": random.gauss(30, 5), "l": title})
    # result_2d_json = {"chartData": {"datasets": {"data": data}}
    result_2d_json = {"chartData": {"datasets": [{"data": data}]}}
    save_path="./api/data/" + page.value["name"]+"/result/result_2d.json"

    with open(save_path,"w") as f:
        json.dump(result_2d_json,f,indent=4,ensure_ascii=False)

if __name__ == '__main__':
    # for page in Page:
    #     summary_data_set = generate_summary_data_set(page)
    #     calc_pca_2d(calc_movie_to_vec(summary_data_set,page=page),page=page)
    page=Page.AMAZON
    summary_data_set = generate_summary_data_set(page)
    calc_pca_2d(calc_movie_to_vec(summary_data_set,page=page),page=page)
