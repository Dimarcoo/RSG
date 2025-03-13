import sys
import os
import json
import numpy as np
from tensorflow.keras.models import load_model

# Cargar el modelo previamente entrenado
model = load_model('C:\\Users\\User\\Desktop\\SCRIP\\modelo\\model.h5')

# Función para procesar los datos de entrada
def preprocess_data(data):
    
    features = []

    for evento in data:
        # Extraer las características relevantes (ajusta según tu modelo)
        features.append([
            evento['IPV4_SRC_ADDR'],
            evento['L4_SRC_PORT'],
            evento['IPV4_DST_ADDR'],
            evento['L4_DST_PORT'],
            evento['PROTOCOL'],
            evento['IN_BYTES'],
            evento['OUT_BYTES'],
            evento['IN_PKTS'],
            evento['OUT_PKTS'],
            evento['FLOW_DURATION_MILLISECONDS']
        ])
    
    return np.array(features)

# Leer los datos desde el stdin
input_data = sys.stdin.read()

# Parsear los datos recibidos
eventos = json.loads(input_data)

# Preprocesar los datos
X = preprocess_data(eventos)

# Realizar la predicción
predicciones = model.predict(X)

# Formatear la salida para enviarla a Node.js
resultados = [{'evento': evento, 'prediccion': pred[0]} for evento, pred in zip(eventos, predicciones)]

# Imprimir los resultados (esto será enviado al stdout y recogido por Node.js)
print(json.dumps(resultados))
