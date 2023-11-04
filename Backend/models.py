from pymodm import MongoModel, fields
# stores the current fuel prices for each fuel station, embedded
class FuelPrice(MongoModel):
    petrol_price = fields.FloatField()
    diesel_price = fields.FloatField()

# stores the fuel prices for each fuel station, and holds info for each fuel station
class FuelStation(MongoModel):
    name = fields.CharField()
    location = fields.CharField()
    current_fuel_prices = fields.EmbeddedDocumentField(FuelPrice)
# stores historical fuel prices for each fuel station
class PetrolFuelPrice(MongoModel):
    fuel_station = fields.ReferenceField(FuelStation)
    price = fields.FloatField()
    timestamp = fields.DateTimeField()
# stores historical fuel prices for each fuel station
class DieselFuelPrice(MongoModel):
    fuel_station = fields.ReferenceField(FuelStation)
    price = fields.FloatField()
    timestamp = fields.DateTimeField()

