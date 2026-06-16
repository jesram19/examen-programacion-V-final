from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

# aca guardamos en memoria segun las instrucciones
contactos_db = []

@app.route('/api/contactos', methods=['POST'])
def crear_contacto():
    datos = request.json
    nuevo_id = str(uuid.uuid4())
    
    nuevo_contacto = {
        "id": nuevo_id,
        "nombre": datos.get("nombre"),
        "apellido": datos.get("apellido"),
        "correo": datos.get("correo"),
        "motivo": datos.get("motivo"),
        "mensaje": datos.get("mensaje")
    }
    
    contactos_db.append(nuevo_contacto)
    
    # imprimir en pantalla el contacto guardado
    print("\n--- NUEVO CONTACTO RECIBIDO ---")
    print(nuevo_contacto)
    print("-------------------------------\n")
    
    return jsonify({"mensaje": "Contacto guardado exitosamente", "contacto": nuevo_contacto}), 201

@app.route('/api/contactos', methods=['GET'])
def obtener_contactos():
    return jsonify(contactos_db), 200

@app.route('/api/contactos/<string:contacto_id>', methods=['GET'])
def obtener_contacto_por_id(contacto_id):
    for contacto in contactos_db:
        if contacto["id"] == contacto_id:
            return jsonify(contacto), 200
            
    return jsonify({"error": "Contacto no encontrado"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)