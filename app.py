from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def calcular_liquido(peso, superficie_corporal=None):
    """
    Calcula a quantidade de líquido necessária com base no peso e na superfície corporal (se necessário).
    :param peso: Peso em kg.
    :param superficie_corporal: Superfície corporal em m² (apenas para peso acima de 30 kg).
    :return: Quantidade de líquido recomendada em ml, dividida por 4.
    """
    if peso <= 10:
        liquido = 100 * peso
    elif 10 < peso <= 20:
        liquido = 1000 + 50 * (peso - 10)
    elif 20 < peso <= 30:
        liquido = 1500 + 20 * (peso - 20)
    else:
        if superficie_corporal is None:
            liquido = 40 * peso  # Pode ser ajustado para 60 ml/kg/dia, se necessário
        else:
            liquido = 1700 + (superficie_corporal - 1.73) * 300  # Cálculo para superfície corporal

    liquido_dividido = liquido / 4
    return liquido_dividido

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calcular', methods=['POST'])
def calcular():
    try:
        peso = float(request.form['peso'])
        if peso > 30:
            superficie_corporal = float(request.form['superficie_corporal'])
            liquido = calcular_liquido(peso, superficie_corporal)
        else:
            liquido = calcular_liquido(peso)

        soro = round(min((peso * 3/4) / 3.4, 30), 1)
        kcl = round(min((peso * 2/4) / 2.5, 20), 1)
        glucanalto = round((peso * 10/4) / 9.3, 1)

        return render_template('index.html', 
                               liquido=liquido, soro=soro, kcl=kcl, glucanalto=glucanalto, peso=peso)

    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(debug=True)
