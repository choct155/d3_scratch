'''
FILE NAME:  get_iris_data.py
AUTHOR:     Marvin Ward Jr.
CREATED:    December 16, 2017

This script just grabs iris data to play with and writes it to disk. It also generates
a static image, with which interactive images can be compared.
'''

# Import libraries
import numpy as np
import pandas as pd
from sklearn import datasets
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import bokeh.palettes as bpal

# Specify output locations
out_dir = '../data/'
fig_dir = '../static_figs/'

# Read in source
iris_src = datasets.load_iris()
iris_X = iris_src.data
iris_X_names = [s[:-5] for s in iris_src.feature_names]
iris_y_labs = iris_src.target_names
iris_y = [iris_y_labs[val] for val in iris_src.target]

# Map colors to class labels
class_colors = dict(zip(iris_y_labs, bpal.Set1_3))

# Convert to DF
iris = pd.DataFrame(iris_X, columns=iris_X_names)
iris['class'] = iris_y
iris['colors'] = iris['class'].map(class_colors)

# Write to disk
iris.to_csv(out_dir+'iris.csv', index=False)

# Generate a scatter plot of sepal length vs sepal width
fig, ax = plt.subplots(figsize=(8,8))
ax.scatter(iris['sepal length'], iris['sepal width'],
           s=50, alpha=0.7, color=iris['colors'])

#Annotate plot
ax.set_xlabel('Sepal Length (cm)')
ax.set_ylabel('Sepal Width (cm)')
ax.set_title('Iris Types: Sepal Length vs Sepal Width', fontsize=16)

# Create legend
leg_patches = {lab:mpatches.Patch(color=class_colors[lab], label=lab) for lab in iris_y_labs}
ax.legend(handles=[leg_patches[lab] for lab in iris_y_labs])
plt.savefig(fig_dir+'static_iris.svg')














