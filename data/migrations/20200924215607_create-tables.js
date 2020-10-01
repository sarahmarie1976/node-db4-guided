
exports.up = function(knex) {
    return knex.schema 
    .createTable('zoos', tbl => {
        tbl.increments();
        tbl.string('zoo_name', 128).notNullable();
        tbl.string('address', 128).notNullable().unique();
    }) 
    .createTable('species', tbl => {
        tbl.increments();
        tbl.string('species_name', 128);
    })
    .createTable('animals', tbl => {
        tbl.increments();
        tbl.string('animal_name', 128);
        tbl.integer('species_id')
            .unsigned()
            .notNullable()
            .references('species.id')
            // or you can do it this way
            // .references('id')
            // .inTable('species');
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })
    .createTable('zoo_animals', tbl => {
        tbl.integer('zoo_id')
            .unsigned()
            .notNullable()
            .references('zoos.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        tbl.integer('animal_id')
            .unsigned()
            .notNullable()
            .references('animals.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        tbl.primary(['zoo_id', 'animal_id']);

        
    })
  
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('zoo_animals')
    .dropTableIfExists('animals')
    .dropTableIfExists('species')
    .dropTableIfExists('zoos');

};



/* 
            line 39 is a composite primary key 
            we would call on the table the primary method
            and then pass in an array of other fields in the table
            that are used to compose a primary key

            so line 39 is saying:
            the primary key for every record isn't going to be it's
            own column but it's going to be a value that the
            db will keep track of that's made up of the values
            from other columns from lines 26 - 39 in particluar


            CASCADING -
                takes the new value if we are updating it and moves 
                it through to the other db's automatically updates them
                so they can stay consistent 

                or if it is

            DELETE - 
                then when we delete a record that is being used by other
                records those other records also get deleted
                so we are ensuring that there's nothing in our DB that's
                pointing to a record that doesn't exist

                so if you delete a record that it's primary key is being
                used in a foreign key field in another table. Any of the records that are pointing to that one, if you delete this primary record then those foreign keys will also be deleted.

            This helps maintain referential integrity.

            NULL -
                We can also set NULL which basically break referential integrity, this is our way of saying yes we know that we're deleting something that other things referring to but we want you to change the foreign key field value to NULL. To indicate that it's not pointing to something that exists.

            NO ACTION -
                this is where you are truly are breaking referential integrity and you should have a really good reason for doing so.  
                    -- this is very uncommon use because you will end up with an invalid data.


        */
