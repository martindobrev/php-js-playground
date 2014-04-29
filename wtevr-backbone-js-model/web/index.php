<?php
require_once __DIR__ . '/../vendor/autoload.php';

/****** REDBEAN SETUP ******/
use \RedBean_Facade as R;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

R::setup('mysql:host=localhost;dbname=backbone','root','root');

$app = new Silex\Application();
$app['debug'] = true;
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__ . '/../views'
));


$app->get('/backbone/{model}', function($model) use ($app) {
    //die($model);
    $models = R::findAll($model);
    $toExport = array();
    foreach($models as $m) {
        $toExport[] = $m->export();
    }
    
    return new Response(json_encode($toExport));
    
    //return $app->json($toExport);
});


// GET MODEL
$app->get('/backbone/{model}/{id}', function($model, $id) use ($app) {
    
    $model = R::getRow('SELECT * FROM ' . $model . ' WHERE id = ?', array($id));
    return $app->json($model);
});

// CREATE MODEL
$app->post('/backbone/{model}', function(Request $request, $model) use ($app) {
    //die('TEST');
    $data = json_decode($request->getContent());
    
    $model = R::dispense($model);
    foreach($data as $key => $value) {
        $model->setAttr($key, $value);
    }
    
    R::store($model);
    
    return $app->json($model->export());
    
});

$app->put('/backbone/{model}/{id}', function(Request $request, $model, $id) use ($app) {
    
    $params = json_decode($request->getContent());
    
    
    $bean = R::load($model, $id);
    
    foreach($params as $key => $value) {
        if ($key !== 'id') {
            $bean->setAttr($key, $value);
        }
    }
    
    R::store($bean);
    
    return new Response(json_encode($bean->export()));
     
});


$app->delete('/backbone/{model}/{id}', function(Request $request, $model, $id) use ($app) {
    
    $bean = R::load($model, $id);
    
    if ($bean->id) {
        R::trash($bean);
        return new Response(json_encode(array('success' => true)));
    } else {
        return new Response(json_encode(array('error' => 'No ' 
            . $model . ' with id ' . $id . ' found!'))
            , Response::HTTP_UNPROCESSABLE_ENTITY);
    }
});

$app->get('', function() use ($app) {
    
    return $app['twig']->render('index.html.twig');
    //return 'SILEX is greeting you, Master!';
});

$app->run();



