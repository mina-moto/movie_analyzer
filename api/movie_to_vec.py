import os
import sys
import MeCab
from gensim import models
import json
from gensim.models.doc2vec import Doc2Vec,TaggedDocument
from sklearn.decomposition import PCA
from sklearn.manifold import MDS,TSNE
from page import Page
import glob
import random

# docを単語に分割しlistで返す
def split_into_words(doc):
    mecab = MeCab.Tagger("-Ochasen")
    lines = mecab.parse(doc).splitlines()
    words = []
    for line in lines:
        chunks = line.split('\t')
        # 名詞，動詞，形容詞のみ
        if len(chunks) > 3 and (chunks[3].startswith('動詞') or chunks[3].startswith('形容詞')
        or (chunks[3].startswith('名詞') and not chunks[3].startswith('名詞-数'))):
            word=chunks[0]
            words.append(word)
    return words

# pageに適した映画のあらすじのデータセットを作成．空の場合は作らない．{"タイトル":["A","B",...]}
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
        summary_data_set[title] = split_into_words(summary)
    return summary_data_set

# 引数のデータセット，ベクトル計算してJson形式で保存後，辞書型で返す
# {タイトル:[1,...,20]}
def calc_movie_to_vec(summary_data_set,page=Page.NOW):
    model = Doc2Vec.load("./api/model/AMAZON_model")
    result_doc_to_vec = {}
    # doc2vecで推論する
    # 結果格納
    for title, summary_data in summary_data_set.items():
        inferred_data=model.infer_vector(summary_data,epochs=50)
        result_doc_to_vec[title] = list(inferred_data)

    # 保存先のpath，なければフォルダ作成(result_2dも同様の場所).
    save_path="./api/data/" + page.value["name"]+"/result/result_doc_to_vec.json"
    dir_path = os.path.dirname(save_path)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    with open(save_path,"w") as f:
        result_doc_to_vec_json={}
        # ベクトルの各要素文字列化
        for title,vec in result_doc_to_vec.items():
            result_doc_to_vec_json[title]=[str(i) for i in vec]
        json.dump(result_doc_to_vec_json,f,indent=4,ensure_ascii=False)
    return result_doc_to_vec

# pca分析を行い2Dに次元削減して，chartjsで読み込めるようJson形式で結果保存
# {"chartData":{"datasets":[{"data":[{"x":double,"y":double,"l":"タイトル"}...]}]}}
def calc_pca_2d(result_doc_to_vec,page=Page.NOW):
    result_2d = []#次元削減後の結果のリスト
    title_list=result_doc_to_vec.keys()
    point_list=PCA(n_components=2).fit_transform(list(result_doc_to_vec.values()))
    for title, point in zip(title_list,point_list):
        result_2d.append({"x": point[0],
                    "y": point[1], "l": title})
    # result_2d_json = {"chartData": {"datasets": {"data": data}}
    result_2d_json = {"chartData": {"datasets": [{"data": result_2d}]}}
    save_path="./api/data/" + page.value["name"]+"/result/result_2d.json"

    # 近くのものを計算してJsonで格納?
    # for title, point in zip(title_list,point_list):

    with open(save_path,"w") as f:
        json.dump(result_2d_json,f,indent=4,ensure_ascii=False)

if __name__ == '__main__':
    # for page in Page:
    #     summary_data_set = generate_summary_data_set(page)
    #     calc_pca_2d(calc_movie_to_vec(summary_data_set,page=page),page=page)
    page=Page.NOW
    summary_data_set = generate_summary_data_set(page)
    calc_pca_2d(calc_movie_to_vec(summary_data_set,page=page),page=page)
