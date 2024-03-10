import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D  # Import for 3D plotting

# Given series of points (x, y, z)
points = [
    (1, 4, 10), (1.5, 5, 10), (2, 6, 10), (3, 7, 10), (6, 9, 10),
    (1, 7, 20), (1.5, 8, 20), (2, 9, 20), (3, 12, 20), (6, 16, 20),
    (1, 9, 30), (1.5, 11, 30), (2, 13, 30), (3, 16, 30), (6, 23, 30),
    (1, 10, 40), (1.5, 13, 40), (2, 15, 40), (3, 20, 40), (6, 29, 40),
    (1, 12, 50), (1.5, 15, 50), (2, 17, 50), (3, 24, 50), (6, 35, 50),
    (1, 13, 60), (1.5, 16, 60), (2, 19, 60), (3, 28, 60), (6, 40, 60),
    (1, 14, 70), (1.5, 18, 70), (2, 21, 70), (3, 31, 70), (6, 46, 70),
    (1, 15, 80), (1.5, 19, 80), (2, 23, 80), (3, 35, 80), (6, 51, 80),
    (1, 16, 90), (1.5, 20, 90), (2, 24, 90), (3, 39, 90), (6, 56, 90),
    (1, 17, 100), (1.5, 21, 100), (2, 25, 100), (3, 42, 100), (6, 61, 100)
]

# Extracting X, Y, and Z values
X_data = np.array([point[0] for point in points])
Y_data = np.array([point[1] for point in points])
Z_data = np.array([point[2] for point in points])

# Combine X and Y into a single feature matrix for polynomial fitting
features = np.column_stack((X_data, Y_data))

# Create polynomial features of 9th degree
poly = PolynomialFeatures(degree=9)
features_poly = poly.fit_transform(features)

# Fit a linear model
model = LinearRegression()
model.fit(features_poly, Z_data)

# Predict and evaluate the model
Z_pred = model.predict(features_poly)
mse = mean_squared_error(Z_data, Z_pred)
r2 = r2_score(Z_data, Z_pred)

print(f"MSE: {mse}, R2: {r2}")

# Print simplified polynomial equation coefficients
print("Model coefficients:", model.coef_)
print("Model intercept:", model.intercept_)

# Basic 3D plot
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# Actual data points
ax.scatter(X_data, Y_data, Z_data, color='b', label='Actual')

# Grid for predicted surface
X_grid, Y_grid = np.meshgrid(np.linspace(np.min(X_data), np.max(X_data), 50),
                             np.linspace(np.min(Y_data), np.max(Y_data), 50))
Z_grid = model.predict(poly.transform(np.column_stack((X_grid.ravel(), Y_grid.ravel())))).reshape(X_grid.shape)

# Predicted surface
ax.plot_surface(X_grid, Y_grid, Z_grid, color='r', alpha=0.5)

ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')
plt.title('Polynomial Regression (Degree 9)')
plt.legend()
plt.show()