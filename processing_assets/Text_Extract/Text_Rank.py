import numpy as np
import pandas as pd
import gensim
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize,sent_tokenize
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
from google.colab import drive
drive.mount('/content/drive')
import pickle

path = '/content/drive/My Drive/Embeddings/glove.840B.300d.pkl'

with open(path,'rb') as f:
  embeddings = pickle.load(f)
from nltk.stem import WordNetLemmatizer
import re
lem = WordNetLemmatizer()
def clean(sentence):
  sentence = sentence.lower()
  sentence = re.sub(r'http\S+',' ',sentence)
  sentence = re.sub(r'[^a-zA-Z]',' ',sentence)
  sentence = sentence.split()
  sentence = [lem.lemmatize(word) for word in sentence if word not in stopwords.words('english')]
  sentence = ' '.join(sentence)
  return sentence
def average_vector(sentence):
  words = sentence.split()
  size = len(words)
  average_vector = np.zeros((size,300))
  unknown_words=[]

  for index,word in enumerate(words):
    try:  
        average_vector[index] = embeddings[word].reshape(1,-1)
    except Exception as e:
      unknown_words.append(word)
      average_vector[index] = 0

  if size!=0:
    average_vector = sum(average_vector)/size
  return average_vector,unknown_words
def cosine_similarity(vector_1,vector_2):
  cosine_similarity = 0
  try:
    cosine_similarity = (np.dot(vector_1,vector_2)/(np.linalg.norm(vector_1)*np.linalg.norm(vector_2)))
  except Exception as e :
    # print("Exception occured",str(e))
    pass
  return cosine_similarity
def find_similarity(string1,string2):
  # string1,string2 = clean(string1),clean(string2)
  vector1,unknown_words1 = average_vector(string1)
  vector2,unknown_words2 = average_vector(string2)
  similarity = cosine_similarity(vector1,vector2)
  return similarity
from bs4 import BeautifulSoup
import requests

subject = input("Enter the wikipedia topic to be summarised")
base_url = "https://en.wikipedia.org/wiki/"+subject
page = requests.get(base_url)

soup = BeautifulSoup(page.content,'html.parser')
paragraphs = soup.find_all('p')

content=""
for paragraph in paragraphs:
    content+=paragraph.text

sentences = sent_tokenize(content)
cleaned_sentences=[]
for sentence in sentences:
  cleaned_sentences.append(clean(sentence))
similarity_matrix = np.zeros((len(cleaned_sentences),len(cleaned_sentences)))

for i in range(0,len(cleaned_sentences)):
  for j in range(0,len(cleaned_sentences)):
    if type(find_similarity(cleaned_sentences[i],cleaned_sentences[j])) == np.float64 :
      similarity_matrix[i,j] = find_similarity(cleaned_sentences[i],cleaned_sentences[j])
similarity_matrix
class Graph:
  
  def __init__(self,graph_dictionary):
    if not graph_dictionary:
      graph_dictionary={}
    self.graph_dictionary = graph_dictionary
  
  def vertices(self):
    return self.graph_dictionary.keys()
  
  def edges(self):
    return self.generate_edges()

  def add_vertex(self,vertex):
    if vertex not in graph_dictionary.keys():
      graph_dictionary[vertex] = []
  
  def add_edge(self,edge):
    vertex1,vertex2 = tuple(set(edge))
    if vertex1 in graph_dictionary.keys():
      graph_dictionary[vertex1].append(vertex2)
    else:
      graph_dictionary[vertex1] = [vertex2]

  def generate_edges(self):
    edges = set()
    for vertex in graph_dictionary.keys():
      for edges in graph_dictionary[vertex]:
        edges.add([vertex,edge])
    return list(edges)
similarity_threshold = 0.70
network_dictionary = {}

for i in range(len(cleaned_sentences)):
    network_dictionary[i] = []  

for i in range(len(cleaned_sentences)):
  for j in range(len(cleaned_sentences)):
    if similarity_matrix[i][j] > similarity_threshold:
      if j not in network_dictionary[i]:
        network_dictionary[i].append(j)
      if i not in network_dictionary[j]:
        network_dictionary[j].append(i)

similarity_matrix
graph = Graph(network_dictionary)
def page_rank(graph,iterations = 50,sentences=20):
  ranks = []
  # ranks = {}
  network = graph.graph_dictionary
  current_ranks = np.squeeze(np.zeros((1,len(cleaned_sentences))))
  prev_ranks = np.array([1/len(cleaned_sentences)]*len(cleaned_sentences))
  for iteration in range(0,iterations):
    for i in range(0,len(list(network.keys()))):
      current_score = 0
      adjacent_vertices = network[list(network.keys())[i]]
      for vertex in adjacent_vertices:
          current_score += prev_ranks[vertex]/len(network[vertex])
      current_ranks[i] = current_score
    prev_ranks = current_ranks
  
  for index in range(len(cleaned_sentences)):
      # ranks[index] = prev_ranks[index]
      if prev_ranks[index]: 
        ranks.append((index,prev_ranks[index]))
  # ranks = {index:rank for index,rank in sorted(ranks.items(),key=ranks.get,reverse=True)}[:sentences]
  ranks = sorted(ranks,key = lambda x:x[1],reverse=True)[:sentences]

  return ranks

ranks = page_rank(graph,iterations=1000)
summary = ""
for index,rank in ranks:
  summary+=sentences[index]+" "
summary
