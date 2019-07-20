import movie_to_vec
from page import Page
from gensim.models.doc2vec import Doc2Vec,TaggedDocument

def train(dataset):
    trainings=[TaggedDocument(doc, [i]) for i, doc in enumerate(dataset.values())]
    # print(len(dataset))
    model = Doc2Vec(documents= trainings,dm=1,min_count=1,vector_size=100,window=5,epochs=200)
    model.save("./api/model/AMAZON_model")


if __name__ == '__main__':
    page=Page.AMAZON
    summary_data_set = movie_to_vec.generate_summary_data_set(page)
    # print(summary_data_set)
    train(dataset=summary_data_set)
