<?php 
/**
 * Basic component class used for querying and manipulating component data.
 * 
 */

class Component {
	protected $pdo;

	/**
	 * Construct our component class
	 *
	 * @param dbconn $pdo
	 * @param string $id
	 */
	public function __construct($pdo){
		$this->pdo = $pdo;
	}


	/**
	 * Return a list of components 
	 */
	public function getComponents($category_id, $limit = 200, $offset = 0){

		try{
            // Get Components
            $query = "SELECT components.*, categories.name AS category_name, M.name AS manufacturer, CP.value as properties
						FROM components
                        LEFT JOIN categories ON components.category_id = categories.category_id
                        LEFT JOIN manufacturers AS M ON components.manufacturer_id = M.manufacturer_id
						LEFT JOIN component_properties AS CP ON CP.component_id = components.component_id
                        WHERE components.status = 'Active' 
							AND components.category_id = :category_id
                        ORDER BY components.name ASC
						LIMIT :limit OFFSET :offset";
			

			$component_stmt = $this->pdo->prepare($query);
			$component_stmt->bindParam(':category_id', $category_id, PDO::PARAM_INT);
			$component_stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
			$component_stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
			$component_stmt->execute();

			$components = [];
			while ($component = $component_stmt->fetchObject()){
				$component->properties = json_decode($component->properties);
				// TODO: Ideally these files would be returned on the initial query. May be able to do a subquery.
				$component->files = $this->getComponentFiles($component->component_id);
				$components[] = $component;
			}

			return $components;

		} catch (PDOException $e) {
			return false;
		}
	}

    /**
	 * Return a list of categories 
	 *
	 * @return array
	 */
	public function getCategories(){

		try{
            $query = "SELECT * FROM categories ORDER BY `name` ASC";

			$stmt = $this->pdo->query($query);

			$categories = [];
			while ($category = $stmt->fetchObject())
			{	
				$categories[] = $category;
			}

			return $categories;

		} catch (PDOException $e) {
			return false;
		}
	}

	public function getComponentFiles($component_id){
		try{
			$query = "SELECT `url` FROM files WHERE component_id = :component_id";

			$stmt = $this->pdo->prepare($query);
			$stmt->bindParam(':component_id', $component_id, PDO::PARAM_INT);
			$stmt->execute();

			$files = [];
			while ($file = $stmt->fetchObject())
			{	
				$files[] = $file->url;
			}

			return $files;

		} catch (PDOException $e) {
			return false;
		}
	}

	public function getTestSources(){
		try{
			$query = "SELECT * FROM test_sources";

			$stmt = $this->pdo->prepare($query);
			$stmt->execute();

			$sources = [];
			while ($source = $stmt->fetchObject())
			{	
				$sources[] = $source;
			}

			return $sources;

		} catch (PDOException $e) {
			return false;
		}
	}

	
}